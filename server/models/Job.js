import { getModel } from '../config/memoryStore.js';
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

const rawModel = mongoose.models['Job'] || mongoose.model('Job', JobSchema);
export default getModel('Job', rawModel);
