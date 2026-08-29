import StudentProfile from '../models/StudentProfile.js';
import User from '../models/User.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import PlacementDrive from '../models/PlacementDrive.js';
import TestResult from '../models/TestResult.js';
import CodingSubmission from '../models/CodingSubmission.js';
import InterviewPractice from '../models/InterviewPractice.js';
import Announcement from '../models/Announcement.js';
import { calculateReadiness } from '../utils/readinessCalculator.js';

export const getProfile = async (req, res, next) => {
  try {
    let profile = await StudentProfile.findOne({ user: req.user.id }).populate('user', 'name email phone avatar college department graduationYear');
    if (!profile) {
      profile = await StudentProfile.create({
        user: req.user.id,
        branch: req.user.department || 'Computer Science & Engineering'
      });
      profile = await profile.populate('user', 'name email phone avatar college department graduationYear');
    }
    res.status(200).json({ success: true, data: profile });
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const {
      name, phone, avatar, rollNumber, cgpa, activeBacklogs, historyOfBacklogs,
      tenthPercentage, twelfthPercentage, branch, gender, bio, location,
      skills, education, projects, experience, certifications, achievements, resumeData
    } = req.body;

    if (name || phone || avatar) {
      await User.findByIdAndUpdate(req.user.id, {
        ...(name && { name }),
        ...(phone !== undefined && { phone }),
        ...(avatar && { avatar })
      });
    }

    let profile = await StudentProfile.findOne({ user: req.user.id });
    if (!profile) {
      profile = new StudentProfile({ user: req.user.id });
    }

    if (rollNumber !== undefined) profile.rollNumber = rollNumber;
    if (cgpa !== undefined) profile.cgpa = Number(cgpa);
    if (activeBacklogs !== undefined) profile.activeBacklogs = Number(activeBacklogs);
    if (historyOfBacklogs !== undefined) profile.historyOfBacklogs = Number(historyOfBacklogs);
    if (tenthPercentage !== undefined) profile.tenthPercentage = Number(tenthPercentage);
    if (twelfthPercentage !== undefined) profile.twelfthPercentage = Number(twelfthPercentage);
    if (branch !== undefined) profile.branch = branch;
    if (gender !== undefined) profile.gender = gender;
    if (bio !== undefined) profile.bio = bio;
    if (location !== undefined) profile.location = location;
    if (skills) profile.skills = skills;
    if (education) profile.education = education;
    if (projects) profile.projects = projects;
    if (experience) profile.experience = experience;
    if (certifications) profile.certifications = certifications;
    if (achievements) profile.achievements = achievements;
    if (resumeData) profile.resumeData = resumeData;

    const testResults = await TestResult.find({ student: req.user.id });
    const codingSubmissions = await CodingSubmission.find({ student: req.user.id });
    const interviewPractices = await InterviewPractice.find({ student: req.user.id });

    profile.readiness = calculateReadiness(profile, testResults, codingSubmissions, interviewPractices);
    await profile.save();

    const populatedProfile = await StudentProfile.findById(profile._id).populate('user', 'name email phone avatar college department graduationYear');

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: populatedProfile
    });
  } catch (err) {
    next(err);
  }
};

export const getStudentDashboard = async (req, res, next) => {
  try {
    const studentId = req.user.id;
    let profile = await StudentProfile.findOne({ user: studentId });
    if (!profile) {
      profile = await StudentProfile.create({ user: studentId });
    }

    const testResults = await TestResult.find({ student: studentId }).sort({ createdAt: -1 });
    const codingSubmissions = await CodingSubmission.find({ student: studentId }).sort({ createdAt: -1 });
    const interviewPractices = await InterviewPractice.find({ student: studentId });

    profile.readiness = calculateReadiness(profile, testResults, codingSubmissions, interviewPractices);
    await profile.save();

    const allApplications = await Application.find({ student: studentId })
      .populate({
        path: 'job',
        populate: { path: 'company', select: 'name logo tier' }
      })
      .sort({ updatedAt: -1 });

    const recentApplications = allApplications.filter(a => a.job && a.job.company).slice(0, 5);

    const allDrives = await PlacementDrive.find({
      status: { $ne: 'Completed' }
    })
      .populate('company', 'name logo tier packageRange')
      .sort({ date: 1 });

    const upcomingDrives = allDrives.filter(d => d.company).slice(0, 4);

    const featuredJobs = await Job.find({
      status: 'Open'
    })
      .populate('company', 'name logo tier location')
      .sort({ createdAt: -1 })
      .limit(6);

    const announcements = await Announcement.find({
      targetRole: { $in: ['All', 'student'] }
    })
      .sort({ createdAt: -1 })
      .limit(4);

    const stats = {
      appliedJobsCount: await Application.countDocuments({ student: studentId }),
      shortlistedCount: await Application.countDocuments({ student: studentId, status: { $in: ['Shortlisted', 'Aptitude Test', 'Technical Interview', 'HR Interview', 'Selected'] } }),
      testsTaken: testResults.length,
      codingSolved: new Set(codingSubmissions.filter(s => s.status === 'Accepted').map(s => s.question.toString())).size,
      interviewQuestionsMastered: interviewPractices.filter(p => p.status === 'Completed').length
    };

    res.status(200).json({
      success: true,
      data: {
        profile,
        readiness: profile.readiness,
        recentApplications,
        upcomingDrives,
        featuredJobs,
        announcements,
        stats
      }
    });
  } catch (err) {
    next(err);
  }
};

export const getStudentDrives = async (req, res, next) => {
  try {
    const drives = await PlacementDrive.find({ status: { $ne: 'Completed' } })
      .populate('company', 'name logo tier packageRange')
      .sort({ date: 1 });
    res.status(200).json({ success: true, data: drives });
  } catch (err) {
    next(err);
  }
};