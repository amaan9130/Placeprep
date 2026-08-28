import { getModel } from '../config/memoryStore.js';
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

const rawModel = mongoose.models['InterviewPractice'] || mongoose.model('InterviewPractice', InterviewPracticeSchema);
export default getModel('InterviewPractice', rawModel);
