import { getModel } from '../config/memoryStore.js';
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

const rawModel = mongoose.models['TestResult'] || mongoose.model('TestResult', TestResultSchema);
export default getModel('TestResult', rawModel);
