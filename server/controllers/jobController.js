import Job from '../models/Job.js';
import Company from '../models/Company.js';
import StudentProfile from '../models/StudentProfile.js';
import Application from '../models/Application.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';

export const getJobs = async (req, res, next) => {
  try {
    const { keyword, company, jobType, minCgpa, maxCtc, minCtc, branch, status = 'Open' } = req.query;

    let query = {};
    if (status && status !== 'All') query.status = status;

    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { skillsRequired: { $regex: keyword, $options: 'i' } }
      ];
    }

    if (jobType && jobType !== 'All') {
      query.jobType = jobType;
    }

    if (minCgpa) {
      query['eligibility.minCgpa'] = { $lte: Number(minCgpa) };
    }

    if (minCtc || maxCtc) {
      query['package.ctc'] = {};
      if (minCtc) query['package.ctc'].$gte = Number(minCtc);
      if (maxCtc) query['package.ctc'].$lte = Number(maxCtc);
    }

    if (branch && branch !== 'All') {
      query['eligibility.allowedBranches'] = { $in: [branch, 'All Branches', 'Computer Science & Engineering', 'Information Technology'] };
    }

    if (company) {
      const companyDoc = await Company.findOne({ name: { $regex: company, $options: 'i' } });
      if (companyDoc) {
        query.company = companyDoc._id;
      }
    }

    const jobs = await Job.find(query)
      .populate('company', 'name logo tier website location description')
      .populate('recruiter', 'name email')
      .sort({ createdAt: -1 });

    let userApplications = [];
    if (req.user && req.user.role === 'student') {
      userApplications = await Application.find({ student: req.user.id }).select('job status');
    }

    const applicationMap = {};
    userApplications.forEach(app => {
      applicationMap[app.job.toString()] = app.status;
    });

    const jobsWithStatus = jobs.map(job => {
      const jobObj = job.toObject();
      jobObj.userApplicationStatus = applicationMap[job._id.toString()] || null;
      return jobObj;
    });

    res.status(200).json({
      success: true,
      count: jobsWithStatus.length,
      data: jobsWithStatus
    });
  } catch (err) {
    next(err);
  }
};

export const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('company')
      .populate('recruiter', 'name email phone');

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job opening not found' });
    }

    let userApplication = null;
    let eligibility = { isEligible: true, reasons: [] };

    if (req.user && req.user.role === 'student') {
      userApplication = await Application.findOne({ job: job._id, student: req.user.id });
      const profile = await StudentProfile.findOne({ user: req.user.id });

      if (profile) {
        if (profile.cgpa < job.eligibility.minCgpa) {
          eligibility.isEligible = false;
          eligibility.reasons.push(`Minimum CGPA required is ${job.eligibility.minCgpa} (Your CGPA: ${profile.cgpa})`);
        }
        if (profile.activeBacklogs > job.eligibility.maxBacklogs) {
          eligibility.isEligible = false;
          eligibility.reasons.push(`Maximum allowed active backlogs is ${job.eligibility.maxBacklogs} (You have: ${profile.activeBacklogs})`);
        }
        if (job.eligibility.allowedBranches && job.eligibility.allowedBranches.length > 0 && !job.eligibility.allowedBranches.includes('All Branches')) {
          if (!job.eligibility.allowedBranches.includes(profile.branch)) {
            eligibility.isEligible = false;
            eligibility.reasons.push(`Branch '${profile.branch}' is not in the list of eligible branches.`);
          }
        }
      }
    }

    res.status(200).json({
      success: true,
      data: {
        job,
        userApplication,
        eligibility
      }
    });
  } catch (err) {
    next(err);
  }
};

export const createJob = async (req, res, next) => {
  try {
    let {
      title, companyId, companyName, description, responsibilities, skillsRequired,
      jobType, location, packageCtc, packageFormatted, packageBreakdown, stipend,
      minCgpa, maxBacklogs, allowedBranches, vacancies, applicationDeadline, driveDate, rounds
    } = req.body;

    let company = null;
    if (companyId) {
      company = await Company.findById(companyId);
    } else if (req.user.companyRef) {
      company = await Company.findById(req.user.companyRef);
    } else if (companyName) {
      company = await Company.findOne({ name: companyName });
      if (!company) {
        company = await Company.create({
          name: companyName,
          logo: `https://ui-avatars.com/api/?name=${encodeURIComponent(companyName)}&background=0284c7&color=fff&size=128`
        });
      }
    }

    if (!company) {
      return res.status(400).json({ success: false, message: 'Valid company reference is required.' });
    }

    const job = await Job.create({
      title,
      company: company._id,
      recruiter: req.user.id,
      description,
      responsibilities: Array.isArray(responsibilities) ? responsibilities : (responsibilities ? responsibilities.split('\n').filter(Boolean) : []),
      skillsRequired: Array.isArray(skillsRequired) ? skillsRequired : (skillsRequired ? skillsRequired.split(',').map(s => s.trim()) : []),
      jobType: jobType || 'Full-time',
      location: location || 'Bengaluru / Hybrid',
      package: {
        ctc: Number(packageCtc) || 12.0,
        formatted: packageFormatted || `${packageCtc || 12} LPA`,
        stipend: stipend || '',
        breakdown: packageBreakdown || ''
      },
      eligibility: {
        minCgpa: Number(minCgpa) || 7.0,
        maxBacklogs: Number(maxBacklogs) || 0,
        allowedBranches: Array.isArray(allowedBranches) ? allowedBranches : (allowedBranches ? allowedBranches.split(',').map(b => b.trim()) : ['Computer Science & Engineering', 'Information Technology', 'Electronics & Communication'])
      },
      vacancies: Number(vacancies) || 10,
      applicationDeadline: applicationDeadline ? new Date(applicationDeadline) : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      driveDate: driveDate ? new Date(driveDate) : null,
      rounds: Array.isArray(rounds) ? rounds : ['Online Aptitude Test', 'Technical Interview 1', 'Technical Interview 2', 'HR Interview']
    });

    company.activeJobsCount = (company.activeJobsCount || 0) + 1;
    await company.save();

    const students = await User.find({ role: 'student', isActive: true }).select('_id');
    const notifications = students.map(st => ({
      recipient: st._id,
      title: `🎯 New Job Opening: ${title} at ${company.name}`,
      message: `${company.name} is hiring for ${title} (${job.package.formatted}). Check requirements and apply!`,
      type: 'Drive',
      link: `/jobs/${job._id}`
    }));

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }

    res.status(201).json({
      success: true,
      message: 'Job posting created successfully.',
      data: job
    });
  } catch (err) {
    next(err);
  }
};

export const updateJob = async (req, res, next) => {
  try {
    let job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (req.user.role === 'recruiter' && job.recruiter && job.recruiter.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized to update this job' });
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ success: true, message: 'Job updated successfully', data: job });
  } catch (err) {
    next(err);
  }
};

export const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }
    
    // Delete all associated applications to prevent orphan references in Student Dashboard
    await Application.deleteMany({ job: job._id });

    await job.deleteOne();
    res.status(200).json({ success: true, message: 'Job opening deleted successfully' });
  } catch (err) {
    next(err);
  }
};