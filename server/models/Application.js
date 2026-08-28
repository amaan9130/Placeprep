import { getModel } from '../config/memoryStore.js';
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

const rawModel = mongoose.models['Application'] || mongoose.model('Application', ApplicationSchema);
export default getModel('Application', rawModel);
