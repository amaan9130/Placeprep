import express from 'express';
import {
  getAdminDashboard, getStudents, toggleStudentStatus,
  createPlacementDrive, createAnnouncement, getCompaniesList,
  getPlacementDrives, deletePlacementDrive
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/dashboard', getAdminDashboard);
router.get('/students', getStudents);
router.put('/students/:id/toggle-status', toggleStudentStatus);
router.get('/drives', getPlacementDrives);
router.post('/drives', createPlacementDrive);
router.delete('/drives/:id', deletePlacementDrive);
router.post('/announcements', createAnnouncement);
router.get('/companies-list', getCompaniesList);

export default router;