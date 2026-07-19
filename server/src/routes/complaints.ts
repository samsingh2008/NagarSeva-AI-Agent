import express from 'express';
import uploadSingle from '../middleware/upload.js';
import {
  checkEscalation,
  createComplaint,
  getComplaintById,
  getComplaints,
  getDashboardSummary,
  getRouteRecommendation,
  getSafetyHeatmap,
  updateComplaintStatus,
} from '../controllers/complaintController.js';

const router = express.Router();

router.post('/', uploadSingle, createComplaint);
router.get('/', getComplaints);
router.get('/heatmap', getSafetyHeatmap);
router.get('/dashboard', getDashboardSummary);
router.post('/route-recommendation', getRouteRecommendation);
router.patch('/:id/status', updateComplaintStatus);
router.post('/:id/check-escalation', checkEscalation);
router.get('/:id', getComplaintById);

export default router;
