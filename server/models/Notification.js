import { getModel } from '../config/memoryStore.js';
import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['Drive', 'Application', 'Interview', 'Announcement', 'Test', 'System'], 
    default: 'System' 
  },
  link: { type: String, default: '' },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const rawModel = mongoose.models['Notification'] || mongoose.model('Notification', NotificationSchema);
export default getModel('Notification', rawModel);
