import { getModel } from '../config/memoryStore.js';
import mongoose from 'mongoose';

const AnnouncementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  priority: { type: String, enum: ['Normal', 'High', 'Urgent'], default: 'Normal' },
  targetRole: { type: String, enum: ['All', 'student', 'recruiter'], default: 'All' },
  attachmentName: { type: String, default: '' },
  attachmentUrl: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const rawModel = mongoose.models['Announcement'] || mongoose.model('Announcement', AnnouncementSchema);
export default getModel('Announcement', rawModel);
