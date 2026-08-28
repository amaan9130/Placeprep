import { getModel } from '../config/memoryStore.js';
import mongoose from 'mongoose';

const HRQuestionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  category: { type: String, default: 'General Behavioral' },
  sampleAnswer: { type: String, required: true },
  framework: { type: String, default: 'STAR Method (Situation, Task, Action, Result)' },
  tips: [{ type: String }],
  keyKeywords: [{ type: String }]
}, { timestamps: true });

const rawModel = mongoose.models['HRQuestion'] || mongoose.model('HRQuestion', HRQuestionSchema);
export default getModel('HRQuestion', rawModel);
