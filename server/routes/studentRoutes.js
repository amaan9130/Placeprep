import express from 'express';
import { getProfile, updateProfile, getStudentDashboard, getStudentDrives } from '../controllers/studentController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.use(authorize('student', 'admin'));

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/dashboard', getStudentDashboard);
router.get('/drives', getStudentDrives);

export default router;