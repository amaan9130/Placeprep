import express from 'express';
import { getRecruiterDashboard, getCompanyProfile, updateCompanyProfile } from '../controllers/recruiterController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.use(authorize('recruiter', 'admin'));

router.get('/dashboard', getRecruiterDashboard);
router.get('/company', getCompanyProfile);
router.put('/company', updateCompanyProfile);

export default router;