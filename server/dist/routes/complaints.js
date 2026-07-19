import express from 'express';
import uploadSingle from '../middleware/upload.js';
import { checkEscalation, createComplaint, getComplaintById, getComplaints, getSafetyHeatmap, updateComplaintStatus, } from '../controllers/complaintController.js';
const router = express.Router();
router.post('/', uploadSingle, createComplaint);
router.get('/', getComplaints);
router.get('/heatmap', getSafetyHeatmap);
router.get('/:id', getComplaintById);
router.patch('/:id/status', updateComplaintStatus);
router.post('/:id/check-escalation', checkEscalation);
export default router;
//# sourceMappingURL=complaints.js.map