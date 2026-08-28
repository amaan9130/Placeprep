import { getModel } from '../config/memoryStore.js';
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

const rawModel = mongoose.models['CodingQuestion'] || mongoose.model('CodingQuestion', CodingQuestionSchema);
export default getModel('CodingQuestion', rawModel);
