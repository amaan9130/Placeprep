import express from 'express';
import {
  getAptitudeQuestions, submitAptitudeTest, getAptitudeHistory,
  getCodingQuestions, getCodingQuestionBySlug, submitCodingSolution,
  getTechnicalQuestions, getHRQuestions, updateInterviewPracticeStatus
} from '../controllers/practiceController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/aptitude/questions', getAptitudeQuestions);
router.post('/aptitude/submit', submitAptitudeTest);
router.get('/aptitude/history', getAptitudeHistory);

router.get('/coding/questions', getCodingQuestions);
router.get('/coding/question/:slug', getCodingQuestionBySlug);
router.post('/coding/submit', submitCodingSolution);

router.get('/interview/technical', getTechnicalQuestions);
router.get('/interview/hr', getHRQuestions);
router.post('/interview/practice-status', updateInterviewPracticeStatus);

export default router;