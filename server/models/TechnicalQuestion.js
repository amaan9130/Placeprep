import { getModel } from '../config/memoryStore.js';
import mongoose from 'mongoose';

const TechnicalQuestionSchema = new mongoose.Schema({
  category: { 
    type: String, 
    enum: ['Java', 'JavaScript', 'React', 'Node.js', 'MongoDB', 'DBMS', 'Operating Systems', 'Computer Networks', 'OOP', 'DSA', 'System Design', 'SQL & Databases', 'Networks', 'Web Technology'], 
    required: true 
  },
  question: { type: String, required: true },
  answer: { type: String, required: true },
  codeSnippet: { type: String, default: '' },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
  frequentlyAskedBy: [{ type: String }]
}, { timestamps: true });

const rawModel = mongoose.models['TechnicalQuestion'] || mongoose.model('TechnicalQuestion', TechnicalQuestionSchema);
export default getModel('TechnicalQuestion', rawModel);
