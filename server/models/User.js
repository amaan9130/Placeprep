import { getModel } from '../config/memoryStore.js';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Name is required'], trim: true },
  email: { 
    type: String, 
    required: [true, 'Email is required'], 
    unique: true, 
    lowercase: true, 
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
  },
  password: { type: String, required: [true, 'Password is required'], minlength: 6, select: false },
  role: { 
    type: String, 
    enum: ['student', 'recruiter', 'admin'], 
    default: 'student', 
    required: true 
  },
  phone: { type: String, default: '' },
  avatar: { type: String, default: '' },
  college: { type: String, default: 'Institute of Technology & Management' },
  department: { type: String, default: 'Computer Science & Engineering' },
  graduationYear: { type: Number, default: 2026 },
  companyName: { type: String, default: '' }, // For recruiter
  companyWebsite: { type: String, default: '' }, // For recruiter
  companyRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  isActive: { type: Boolean, default: true },
  isEmailVerified: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign(
    { id: this._id, role: this.role, name: this.name, email: this.email },
    process.env.JWT_SECRET || 'placeprep_super_secret_jwt_key_2026',
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  );
};

const rawModel = mongoose.models['User'] || mongoose.model('User', UserSchema);
export default getModel('User', rawModel);
