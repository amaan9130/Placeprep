import { getModel } from '../config/memoryStore.js';
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

const rawModel = mongoose.models['AptitudeQuestion'] || mongoose.model('AptitudeQuestion', AptitudeQuestionSchema);
export default getModel('AptitudeQuestion', rawModel);
