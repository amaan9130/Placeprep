import express from 'express';
import { registerStudent, registerRecruiter, login, getMe, demoLogin } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register/student', registerStudent);
router.post('/register/recruiter', registerRecruiter);
router.post('/login', login);
router.post('/demo-login', demoLogin);
router.get('/me', protect, getMe);

export default router;