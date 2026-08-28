import { getModel } from '../config/memoryStore.js';
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
    overall: { type: Number, default: 0 },
    aptitude: { type: Number, default: 0 },
    coding: { type: Number, default: 0 },
    technical: { type: Number, default: 0 },
    interview: { type: Number, default: 0 },
    resume: { type: Number, default: 0 },
    profileCompletion: { type: Number, default: 0 },
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

const rawModel = mongoose.models['StudentProfile'] || mongoose.model('StudentProfile', StudentProfileSchema);
export default getModel('StudentProfile', rawModel);
