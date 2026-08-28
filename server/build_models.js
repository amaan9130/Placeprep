import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const writeFile = (relPath, content) => {
  const fullPath = path.join(__dirname, relPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim() + '\n', 'utf8');
  console.log(`[OK] Created ${relPath}`);
};

// 1. .env & .env.example
const envContent = `
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/placeprep
JWT_SECRET=placeprep_super_secret_jwt_key_2026_production_ready
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:5173
`;
writeFile('.env', envContent);
writeFile('.env.example', envContent);

// 2. config/db.js
const dbConfig = `
import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) return;
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/placeprep';

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2500,
    });
    isConnected = true;
    console.log(\`✅ MongoDB Connected: \${conn.connection.host}/\${conn.connection.name}\`);
    return conn;
  } catch (err) {
    console.warn(\`⚠️ Direct MongoDB connection to \${mongoUri} failed: \${err.message}\`);
    console.log('🔄 Attempting fallback to in-memory database or offline mock data...');
    try {
      // Try mongodb-memory-server dynamically if installed
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const memUri = mongod.getUri();
      const conn = await mongoose.connect(memUri);
      isConnected = true;
      console.log(\`✅ Connected to Embedded In-Memory MongoDB at: \${memUri}\`);
      return conn;
    } catch (memErr) {
      console.error('❌ Could not start in-memory MongoDB. Please start a local MongoDB or set MONGO_URI in .env:', memErr.message);
      throw err;
    }
  }
};
`;
writeFile('config/db.js', dbConfig);

// 3. Models
// User.js
writeFile('models/User.js', `
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Name is required'], trim: true },
  email: { 
    type: String, 
    required: [true, 'Email is required'], 
    unique: true, 
    lowercase: true, 
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
  },
  password: { type: String, required: [true, 'Password is required'], minlength: 6, select: false },
  role: { 
    type: String, 
    enum: ['student', 'recruiter', 'admin'], 
    default: 'student', 
    required: true 
  },
  phone: { type: String, default: '' },
  avatar: { type: String, default: '' },
  college: { type: String, default: 'Institute of Technology & Management' },
  department: { type: String, default: 'Computer Science & Engineering' },
  graduationYear: { type: Number, default: 2026 },
  companyName: { type: String, default: '' }, // For recruiter
  companyWebsite: { type: String, default: '' }, // For recruiter
  companyRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  isActive: { type: Boolean, default: true },
  isEmailVerified: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign(
    { id: this._id, role: this.role, name: this.name, email: this.email },
    process.env.JWT_SECRET || 'placeprep_super_secret_jwt_key_2026',
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  );
};

export default mongoose.model('User', UserSchema);
`);

// StudentProfile.js
writeFile('models/StudentProfile.js', `
import mongoose from 'mongoose';

const StudentProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  rollNumber: { type: String, default: '' },
  cgpa: { type: Number, default: 8.0, min: 0, max: 10 },
  activeBacklogs: { type: Number, default: 0, min: 0 },
  historyOfBacklogs: { type: Number, default: 0, min: 0 },
  tenthPercentage: { type: Number, default: 88.0 },
  twelfthPercentage: { type: Number, default: 85.0 },
  branch: { type: String, default: 'Computer Science & Engineering' },
  gender: { type: String, default: 'Prefer not to say' },
  bio: { type: String, default: 'Passionate software engineering student eager to build scalable web applications and solve algorithmic challenges.' },
  location: { type: String, default: 'Bengaluru, India' },
  skills: [{
    name: { type: String, required: true },
    level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'], default: 'Intermediate' }
  }],
  education: [{
    degree: { type: String, required: true },
    institution: { type: String, required: true },
    fieldOfStudy: { type: String, default: '' },
    startYear: { type: Number },
    endYear: { type: Number },
    grade: { type: String }
  }],
  projects: [{
    title: { type: String, required: true },
    description: { type: String },
    technologies: [{ type: String }],
    githubUrl: { type: String, default: '' },
    liveUrl: { type: String, default: '' },
    startDate: { type: String },
    endDate: { type: String }
  }],
  experience: [{
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String },
    startDate: { type: String },
    endDate: { type: String },
    current: { type: Boolean, default: false },
    description: { type: String }
  }],
  certifications: [{
    name: { type: String, required: true },
    issuer: { type: String, required: true },
    issueDate: { type: String },
    credentialUrl: { type: String, default: '' }
  }],
  achievements: [{ type: String }],
  resumeUrl: { type: String, default: '' },
  resumeData: {
    summary: { type: String, default: '' },
    customSections: [{ heading: String, content: String }]
  },
  readiness: {
    overall: { type: Number, default: 75 },
    aptitude: { type: Number, default: 70 },
    coding: { type: Number, default: 65 },
    technical: { type: Number, default: 80 },
    interview: { type: Number, default: 60 },
    resume: { type: Number, default: 85 },
    profileCompletion: { type: Number, default: 80 },
    recommendations: [{ type: String }]
  },
  aptitudeScores: [{
    category: String,
    score: Number,
    total: Number,
    accuracy: Number,
    date: { type: Date, default: Date.now }
  }],
  solvedCoding: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CodingQuestion' }],
  placementStatus: {
    type: String,
    enum: ['Not Placed', 'Placed', 'Offer Received', 'Opted Out'],
    default: 'Not Placed'
  },
  placedCompany: { type: String, default: '' },
  placedPackage: { type: Number, default: 0 } // In LPA
}, { timestamps: true });

export default mongoose.model('StudentProfile', StudentProfileSchema);
`);

// Company.js
writeFile('models/Company.js', `
import mongoose from 'mongoose';

const CompanySchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Company name is required'], unique: true, trim: true },
  logo: { type: String, default: 'https://images.unsplash.com/photo-1549924231-f129b911e442?w=128&h=128&fit=crop' },
  website: { type: String, default: '' },
  description: { type: String, default: '' },
  industry: { type: String, default: 'Information Technology' },
  location: { type: String, default: 'Bengaluru, India' },
  recruiters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  tier: { type: String, enum: ['Tier 1 (Dream)', 'Tier 2 (Super Dream)', 'Tier 3 (Core/Mass)'], default: 'Tier 1 (Dream)' },
  packageRange: { type: String, default: '12 - 24 LPA' },
  isVerified: { type: Boolean, default: true },
  activeJobsCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('Company', CompanySchema);
`);

// Job.js
writeFile('models/Job.js', `
import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Job title is required'], trim: true },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  recruiter: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  description: { type: String, required: true },
  responsibilities: [{ type: String }],
  skillsRequired: [{ type: String }],
  jobType: { 
    type: String, 
    enum: ['Full-time', 'Internship', 'FTE + Internship', 'Part-time'], 
    default: 'Full-time' 
  },
  location: { type: String, default: 'Bengaluru / Hybrid' },
  package: {
    ctc: { type: Number, required: true }, // in LPA (e.g. 14.5)
    formatted: { type: String, default: '14.5 LPA' },
    stipend: { type: String, default: '₹50,000 / month' },
    breakdown: { type: String, default: 'Base: 12 LPA + Retention Bonus: 2.5 LPA' }
  },
  eligibility: {
    minCgpa: { type: Number, default: 7.0 },
    maxBacklogs: { type: Number, default: 0 },
    allowedBranches: [{ type: String }],
    allowedGraduationYears: [{ type: Number, default: [2025, 2026] }],
    minTenthPercentage: { type: Number, default: 60 },
    minTwelfthPercentage: { type: Number, default: 60 }
  },
  vacancies: { type: Number, default: 10 },
  applicationDeadline: { type: Date, required: true },
  driveDate: { type: Date },
  rounds: [{ type: String }],
  status: { type: String, enum: ['Open', 'Closed', 'Draft'], default: 'Open' },
  applicantsCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('Job', JobSchema);
`);

// Application.js
writeFile('models/Application.js', `
import mongoose from 'mongoose';

const ApplicationSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  studentProfile: { type: mongoose.Schema.Types.ObjectId, ref: 'StudentProfile' },
  status: {
    type: String,
    enum: [
      'Applied',
      'Shortlisted',
      'Aptitude Test',
      'Technical Interview',
      'HR Interview',
      'Selected',
      'Rejected'
    ],
    default: 'Applied'
  },
  timeline: [{
    stage: { type: String, required: true },
    status: { type: String, required: true },
    date: { type: Date, default: Date.now },
    notes: { type: String, default: '' },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }],
  interviewSchedule: {
    stage: { type: String },
    date: { type: Date },
    time: { type: String },
    meetingLink: { type: String },
    venue: { type: String },
    instructions: { type: String }
  },
  feedback: { type: String, default: '' },
  score: { type: Number, default: 0 },
  appliedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Prevent duplicate applications
ApplicationSchema.index({ job: 1, student: 1 }, { unique: true });

export default mongoose.model('Application', ApplicationSchema);
`);

// PlacementDrive.js
writeFile('models/PlacementDrive.js', `
import mongoose from 'mongoose';

const PlacementDriveSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  jobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
  date: { type: Date, required: true },
  venue: { type: String, default: 'Campus Auditorium / Virtual' },
  description: { type: String, default: '' },
  eligibleBranches: [{ type: String }],
  status: { type: String, enum: ['Upcoming', 'Ongoing', 'Completed'], default: 'Upcoming' },
  coordinator: { type: String, default: 'Prof. Placement Cell' },
  instructions: [{ type: String }]
}, { timestamps: true });

export default mongoose.model('PlacementDrive', PlacementDriveSchema);
`);

// AptitudeQuestion.js
writeFile('models/AptitudeQuestion.js', `
import mongoose from 'mongoose';

const AptitudeQuestionSchema = new mongoose.Schema({
  category: { 
    type: String, 
    enum: ['Quantitative', 'Logical', 'Verbal', 'Data Interpretation'], 
    required: true 
  },
  subcategory: { type: String, default: 'General' },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctOptionIndex: { type: Number, required: true },
  explanation: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model('AptitudeQuestion', AptitudeQuestionSchema);
`);

// TestResult.js
writeFile('models/TestResult.js', `
import mongoose from 'mongoose';

const TestResultSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true },
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  accuracy: { type: Number, required: true },
  timeTakenSeconds: { type: Number, default: 0 },
  answers: [{
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'AptitudeQuestion' },
    questionText: String,
    selectedOption: Number,
    correctOption: Number,
    isCorrect: Boolean,
    explanation: String
  }],
  categoryBreakdown: { type: Map, of: Number },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('TestResult', TestResultSchema);
`);

// CodingQuestion.js
writeFile('models/CodingQuestion.js', `
import mongoose from 'mongoose';

const CodingQuestionSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Easy' },
  category: { 
    type: String, 
    enum: [
      'Arrays', 'Strings', 'Linked Lists', 'Stacks', 'Queues', 
      'Trees', 'Sorting', 'Searching', 'Recursion', 'Dynamic Programming', 'Graphs'
    ], 
    required: true 
  },
  description: { type: String, required: true },
  inputFormat: { type: String, default: '' },
  outputFormat: { type: String, default: '' },
  examples: [{
    input: { type: String, required: true },
    output: { type: String, required: true },
    explanation: { type: String, default: '' }
  }],
  constraints: [{ type: String }],
  starterCode: {
    javascript: { type: String, default: '' },
    python: { type: String, default: '' },
    java: { type: String, default: '' },
    cpp: { type: String, default: '' }
  },
  testCases: [{
    input: { type: String, required: true },
    expectedOutput: { type: String, required: true },
    isHidden: { type: Boolean, default: false }
  }],
  solutionApproach: { type: String, default: '' },
  timeComplexity: { type: String, default: 'O(N)' },
  spaceComplexity: { type: String, default: 'O(1)' }
}, { timestamps: true });

export default mongoose.model('CodingQuestion', CodingQuestionSchema);
`);

// CodingSubmission.js
writeFile('models/CodingSubmission.js', `
import mongoose from 'mongoose';

const CodingSubmissionSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  question: { type: mongoose.Schema.Types.ObjectId, ref: 'CodingQuestion', required: true },
  code: { type: String, required: true },
  language: { type: String, default: 'javascript' },
  status: { 
    type: String, 
    enum: ['Accepted', 'Wrong Answer', 'Runtime Error', 'Time Limit Exceeded'], 
    default: 'Accepted' 
  },
  passedTestCases: { type: Number, default: 0 },
  totalTestCases: { type: Number, default: 0 },
  runtimeMs: { type: Number, default: 45 },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('CodingSubmission', CodingSubmissionSchema);
`);

// TechnicalQuestion.js
writeFile('models/TechnicalQuestion.js', `
import mongoose from 'mongoose';

const TechnicalQuestionSchema = new mongoose.Schema({
  category: { 
    type: String, 
    enum: ['Java', 'JavaScript', 'React', 'Node.js', 'MongoDB', 'DBMS', 'Operating Systems', 'Computer Networks', 'OOP', 'DSA'], 
    required: true 
  },
  question: { type: String, required: true },
  answer: { type: String, required: true },
  codeSnippet: { type: String, default: '' },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
  frequentlyAskedBy: [{ type: String }]
}, { timestamps: true });

export default mongoose.model('TechnicalQuestion', TechnicalQuestionSchema);
`);

// HRQuestion.js
writeFile('models/HRQuestion.js', `
import mongoose from 'mongoose';

const HRQuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  category: { type: String, default: 'General Behavioral' },
  sampleAnswer: { type: String, required: true },
  framework: { type: String, default: 'STAR Method (Situation, Task, Action, Result)' },
  tips: [{ type: String }],
  keyKeywords: [{ type: String }]
}, { timestamps: true });

export default mongoose.model('HRQuestion', HRQuestionSchema);
`);

// InterviewPractice.js
writeFile('models/InterviewPractice.js', `
import mongoose from 'mongoose';

const InterviewPracticeSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  questionId: { type: String, required: true },
  questionType: { type: String, enum: ['Technical', 'HR'], required: true },
  status: { type: String, enum: ['Not Started', 'Practicing', 'Completed'], default: 'Practicing' },
  studentNotes: { type: String, default: '' },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

InterviewPracticeSchema.index({ student: 1, questionId: 1 }, { unique: true });

export default mongoose.model('InterviewPractice', InterviewPracticeSchema);
`);

// Notification.js
writeFile('models/Notification.js', `
import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['Drive', 'Application', 'Interview', 'Announcement', 'Test', 'System'], 
    default: 'System' 
  },
  link: { type: String, default: '' },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('Notification', NotificationSchema);
`);

// Announcement.js
writeFile('models/Announcement.js', `
import mongoose from 'mongoose';

const AnnouncementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  priority: { type: String, enum: ['Normal', 'High', 'Urgent'], default: 'Normal' },
  targetRole: { type: String, enum: ['All', 'student', 'recruiter'], default: 'All' },
  attachmentName: { type: String, default: '' },
  attachmentUrl: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('Announcement', AnnouncementSchema);
`);

console.log('✅ Models created successfully.');