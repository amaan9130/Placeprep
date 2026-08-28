import Application from '../models/Application.js';
import Job from '../models/Job.js';
import StudentProfile from '../models/StudentProfile.js';
import Notification from '../models/Notification.js';

export const applyForJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const studentId = req.user.id;

    const job = await Job.findById(jobId).populate('company');
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job opening not found' });
    }

    if (job.status !== 'Open') {
      return res.status(400).json({ success: false, message: 'This job opening is currently closed.' });
    }

    const existingApp = await Application.findOne({ job: jobId, student: studentId });
    if (existingApp) {
      return res.status(400).json({ success: false, message: 'You have already submitted an application for this position.' });
    }

    const profile = await StudentProfile.findOne({ user: studentId });
    if (!profile) {
      return res.status(400).json({ success: false, message: 'Please complete your student profile before applying.' });
    }

    if (profile.cgpa < job.eligibility.minCgpa) {
      return res.status(400).json({
        success: false,
        message: `Minimum CGPA required is ${job.eligibility.minCgpa}. Your CGPA: ${profile.cgpa}`
      });
    }

    if (profile.activeBacklogs > job.eligibility.maxBacklogs) {
      return res.status(400).json({
        success: false,
        message: `Maximum allowed active backlogs is ${job.eligibility.maxBacklogs}. You have: ${profile.activeBacklogs}`
      });
    }

    const application = await Application.create({
      job: jobId,
      student: studentId,
      studentProfile: profile._id,
      status: 'Applied',
      timeline: [{
        stage: 'Application Submitted',
        status: 'Applied',
        date: new Date(),
        notes: 'Application successfully received by placement portal.'
      }]
    });

    job.applicantsCount = (job.applicantsCount || 0) + 1;
    await job.save();

    await Notification.create({
      recipient: studentId,
      title: `Application Submitted: ${job.title}`,
      message: `Your application for ${job.title} at ${job.company.name} has been submitted. Check the Applications tab for status updates.`,
      type: 'Application',
      link: '/student/applications'
    });

    if (job.recruiter) {
      await Notification.create({
        recipient: job.recruiter,
        title: `New Applicant for ${job.title}`,
        message: `${req.user.name} (${profile.cgpa} CGPA, ${profile.branch}) has applied for ${job.title}.`,
        type: 'Application',
        link: `/recruiter/applicants?jobId=${job._id}`
      });
    }

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully!',
      data: application
    });
  } catch (err) {
    next(err);
  }
};

export const getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ student: req.user.id })
      .populate({
        path: 'job',
        populate: { path: 'company', select: 'name logo tier packageRange location website' }
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (err) {
    next(err);
  }
};

export const getJobApplications = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const { status, minCgpa, search } = req.query;

    let query = { job: jobId };
    if (status && status !== 'All') {
      query.status = status;
    }

    let applications = await Application.find(query)
      .populate('student', 'name email phone avatar college department graduationYear')
      .populate('studentProfile')
      .populate({
        path: 'job',
        populate: { path: 'company', select: 'name logo tier' }
      })
      .sort({ createdAt: -1 });

    if (minCgpa) {
      applications = applications.filter(app => (app.studentProfile?.cgpa || 0) >= Number(minCgpa));
    }

    if (search) {
      const s = search.toLowerCase();
      applications = applications.filter(app =>
        app.student?.name?.toLowerCase().includes(s) ||
        app.student?.email?.toLowerCase().includes(s) ||
        app.studentProfile?.rollNumber?.toLowerCase().includes(s) ||
        app.studentProfile?.skills?.some(sk => sk.name.toLowerCase().includes(s))
      );
    }

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (err) {
    next(err);
  }
};

export const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, notes, interviewSchedule } = req.body;
    const application = await Application.findById(req.params.id)
      .populate('student', 'name email')
      .populate({
        path: 'job',
        populate: { path: 'company', select: 'name logo package' }
      });

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    application.status = status;
    application.timeline.push({
      stage: status,
      status,
      date: new Date(),
      notes: notes || `Candidate moved to ${status}`,
      updatedBy: req.user.id
    });

    if (interviewSchedule) {
      application.interviewSchedule = interviewSchedule;
    }

    await application.save();

    if (status === 'Selected') {
      await StudentProfile.findOneAndUpdate(
        { user: application.student._id },
        {
          placementStatus: 'Placed',
          placedCompany: application.job.company.name,
          placedPackage: application.job.package.ctc
        }
      );
    }

    let notifMessage = `Your application for ${application.job.title} at ${application.job.company.name} is now: ${status}.`;
    if (status === 'Shortlisted') notifMessage = `Congratulations! You have been shortlisted for ${application.job.title} at ${application.job.company.name}.`;
    if (status.includes('Interview')) notifMessage = `Interview Scheduled! You have a ${status} for ${application.job.title} at ${application.job.company.name}.`;
    if (status === 'Selected') notifMessage = `🎉 Congratulations! You have received a placement offer for ${application.job.title} from ${application.job.company.name}!`;

    await Notification.create({
      recipient: application.student._id,
      title: `Application Status: ${status}`,
      message: notifMessage,
      type: status.includes('Interview') ? 'Interview' : 'Application',
      link: '/student/applications'
    });

    res.status(200).json({
      success: true,
      message: `Status updated to ${status}`,
      data: application
    });
  } catch (err) {
    next(err);
  }
};