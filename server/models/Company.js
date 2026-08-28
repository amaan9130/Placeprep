import { getModel } from '../config/memoryStore.js';
import mongoose from 'mongoose';

const CompanySchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Company name is required'], unique: true, trim: true },
  logo: { type: String, default: 'https://images.unsplash.com/photo-1549924231-f129b911e442?w=128&h=128&fit=crop' },
  website: { type: String, default: '' },
  description: { type: String, default: '' },
  industry: { type: String, default: 'Information Technology' },
  location: { type: String, default: 'Bengaluru, India' },
  recruiters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  tier: { type: String, enum: ['Tier 1 (Dream)', 'Tier 2 (Super Dream)', 'Tier 3 (Core/Mass)'], default: 'Tier 1 (Dream)' },
  packageRange: { type: String, default: '12 - 24 LPA' },
  isVerified: { type: Boolean, default: true },
  activeJobsCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const rawModel = mongoose.models['Company'] || mongoose.model('Company', CompanySchema);
export default getModel('Company', rawModel);
