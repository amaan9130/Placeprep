import { getModel } from '../config/memoryStore.js';
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

const rawModel = mongoose.models['CodingSubmission'] || mongoose.model('CodingSubmission', CodingSubmissionSchema);
export default getModel('CodingSubmission', rawModel);
