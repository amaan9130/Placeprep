import { getModel } from '../config/memoryStore.js';
import mongoose from 'mongoose';

const PlacementDriveSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  jobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
  date: { type: Date, required: true },
  venue: { type: String, default: 'Campus Auditorium / Virtual' },
  description: { type: String, default: '' },
  eligibleBranches: [{ type: String }],
  status: { type: String, enum: ['Upcoming', 'Ongoing', 'Completed'], default: 'Upcoming' },
  coordinator: { type: String, default: 'Prof. Placement Cell' },
  instructions: [{ type: String }]
}, { timestamps: true });

const rawModel = mongoose.models['PlacementDrive'] || mongoose.model('PlacementDrive', PlacementDriveSchema);
export default getModel('PlacementDrive', rawModel);
