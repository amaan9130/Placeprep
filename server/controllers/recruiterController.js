import Job from '../models/Job.js';
import Application from '../models/Application.js';
import Company from '../models/Company.js';

export const getRecruiterDashboard = async (req, res, next) => {
  try {
    const recruiterId = req.user.id;
    const companyId = req.user.companyRef;

    const query = companyId ? { company: companyId } : { recruiter: recruiterId };

    const jobs = await Job.find(query).populate('company', 'name logo').sort({ createdAt: -1 });
    const jobIds = jobs.map(j => j._id);

    const applications = await Application.find({ job: { $in: jobIds } })
      .populate('student', 'name email phone avatar college department')
      .populate('studentProfile')
      .populate({ path: 'job', select: 'title package location jobType' })
      .sort({ updatedAt: -1 });

    const stats = {
      totalJobs: jobs.length,
      activeJobs: jobs.filter(j => j.status === 'Open').length,
      totalApplicants: applications.length,
      shortlisted: applications.filter(a => a.status === 'Shortlisted').length,
      inInterview: applications.filter(a => ['Aptitude Test', 'Technical Interview', 'HR Interview'].includes(a.status)).length,
      selected: applications.filter(a => a.status === 'Selected').length,
      rejected: applications.filter(a => a.status === 'Rejected').length
    };

    const stageDistribution = [
      { name: 'Applied', value: applications.filter(a => a.status === 'Applied').length },
      { name: 'Shortlisted', value: applications.filter(a => a.status === 'Shortlisted').length },
      { name: 'Aptitude Test', value: applications.filter(a => a.status === 'Aptitude Test').length },
      { name: 'Technical Interview', value: applications.filter(a => a.status === 'Technical Interview').length },
      { name: 'HR Interview', value: applications.filter(a => a.status === 'HR Interview').length },
      { name: 'Selected', value: applications.filter(a => a.status === 'Selected').length },
      { name: 'Rejected', value: applications.filter(a => a.status === 'Rejected').length }
    ];

    res.status(200).json({
      success: true,
      data: {
        stats,
        stageDistribution,
        jobs,
        recentApplicants: applications.slice(0, 10)
      }
    });
  } catch (err) {
    next(err);
  }
};

export const getCompanyProfile = async (req, res, next) => {
  try {
    let company = null;
    if (req.user.companyRef) {
      company = await Company.findById(req.user.companyRef);
    } else if (req.user.companyName) {
      company = await Company.findOne({ name: req.user.companyName });
    }

    if (!company) {
      return res.status(404).json({ success: false, message: 'Company profile not found' });
    }

    res.status(200).json({ success: true, data: company });
  } catch (err) {
    next(err);
  }
};

export const updateCompanyProfile = async (req, res, next) => {
  try {
    let company = null;
    if (req.user.companyRef) {
      company = await Company.findById(req.user.companyRef);
    }

    if (!company) {
      company = new Company({
        name: req.user.companyName || 'Company Enterprise',
        recruiters: [req.user.id]
      });
    }

    const { name, logo, website, description, industry, location, packageRange } = req.body;
    if (name) company.name = name;
    if (logo) company.logo = logo;
    if (website) company.website = website;
    if (description) company.description = description;
    if (industry) company.industry = industry;
    if (location) company.location = location;
    if (packageRange) company.packageRange = packageRange;

    await company.save();
    res.status(200).json({ success: true, message: 'Company profile updated successfully', data: company });
  } catch (err) {
    next(err);
  }
};