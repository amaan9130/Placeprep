import User from '../models/User.js';
import StudentProfile from '../models/StudentProfile.js';
import Company from '../models/Company.js';
import Notification from '../models/Notification.js';

const sendTokenResponse = (user, statusCode, res, profile = null) => {
  const token = user.getSignedJwtToken();
  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      college: user.college,
      department: user.department,
      graduationYear: user.graduationYear,
      companyName: user.companyName,
      companyRef: user.companyRef
    },
    profile
  });
};

export const registerStudent = async (req, res, next) => {
  try {
    const { name, email, password, college, department, graduationYear, phone } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email is already registered' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: 'student',
      college: college || 'Institute of Technology & Management',
      department: department || 'Computer Science & Engineering',
      graduationYear: graduationYear || 2026,
      phone: phone || '',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`
    });

    const profile = await StudentProfile.create({
      user: user._id,
      branch: department || 'Computer Science & Engineering',
      skills: [
        { name: 'JavaScript', level: 'Intermediate' },
        { name: 'React.js', level: 'Intermediate' },
        { name: 'Node.js', level: 'Beginner' }
      ],
      education: [{
        degree: 'B.Tech in Computer Science',
        institution: college || 'Institute of Technology & Management',
        fieldOfStudy: department || 'Computer Science & Engineering',
        startYear: (graduationYear || 2026) - 4,
        endYear: graduationYear || 2026,
        grade: '8.2 CGPA'
      }],
      readiness: {
        overall: 0,
        aptitude: 0,
        coding: 0,
        technical: 0,
        interview: 0,
        resume: 0,
        profileCompletion: 0,
        recommendations: [
          'Complete your profile with project links and certifications.',
          'Practice aptitude and coding assessments to raise your readiness score.'
        ]
      }
    });

    await Notification.create({
      recipient: user._id,
      title: 'Welcome to PlacePrep! 🚀',
      message: 'Your student account is all set. Start by exploring placement opportunities and taking practice assessments.',
      type: 'System',
      link: '/student/dashboard'
    });

    sendTokenResponse(user, 201, res, profile);
  } catch (err) {
    next(err);
  }
};

export const registerRecruiter = async (req, res, next) => {
  try {
    const { name, email, password, companyName, companyWebsite, phone } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email is already registered' });
    }

    let company = await Company.findOne({ name: new RegExp('^' + companyName + '$', 'i') });
    if (!company) {
      company = await Company.create({
        name: companyName,
        website: companyWebsite || '',
        logo: `https://ui-avatars.com/api/?name=${encodeURIComponent(companyName)}&background=0284c7&color=fff&size=128`,
        description: `Leading technology and solutions enterprise: ${companyName}`,
        isVerified: true
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: 'recruiter',
      companyName,
      companyWebsite: companyWebsite || '',
      companyRef: company._id,
      phone: phone || '',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`
    });

    if (!company.recruiters.includes(user._id)) {
      company.recruiters.push(user._id);
      await company.save();
    }

    sendTokenResponse(user, 201, res);
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password, expectedRole } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Account is deactivated. Contact administrator.' });
    }

    if (expectedRole && user.role !== expectedRole) {
      return res.status(403).json({
        success: false,
        message: `Account is registered as '${user.role}', not '${expectedRole}'. Please select correct role.`
      });
    }

    let profile = null;
    if (user.role === 'student') {
      profile = await StudentProfile.findOne({ user: user._id });
    }

    sendTokenResponse(user, 200, res, profile);
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    let profile = null;
    if (user.role === 'student') {
      profile = await StudentProfile.findOne({ user: user._id });
    }
    res.status(200).json({ success: true, user, profile });
  } catch (err) {
    next(err);
  }
};

export const demoLogin = async (req, res, next) => {
  try {
    const { role } = req.body;
    let targetEmail = 'student@placeprep.edu';
    if (role === 'admin') targetEmail = 'admin@placeprep.edu';
    if (role === 'recruiter') targetEmail = 'recruiter@google.com';

    const user = await User.findOne({ email: targetEmail });
    if (!user) {
      return res.status(404).json({ success: false, message: `Demo user for role ${role} not found. Please run seed script.` });
    }

    let profile = null;
    if (user.role === 'student') {
      profile = await StudentProfile.findOne({ user: user._id });
    }

    sendTokenResponse(user, 200, res, profile);
  } catch (err) {
    next(err);
  }
};