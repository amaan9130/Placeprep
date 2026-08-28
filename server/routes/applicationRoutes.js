import express from 'express';
import { applyForJob, getMyApplications, getJobApplications, updateApplicationStatus } from '../controllers/applicationController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post('/apply/:jobId', authorize('student'), applyForJob);
router.get('/my', authorize('student'), getMyApplications);
router.get('/job/:jobId', authorize('recruiter', 'admin'), getJobApplications);
router.put('/:id/status', authorize('recruiter', 'admin'), updateApplicationStatus);

export default router;