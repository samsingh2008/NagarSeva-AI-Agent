import express from 'express';
import uploadSingle from '../middleware/upload.js';
import { createComplaint, getComplaintById, getComplaints, updateComplaintStatus, } from '../controllers/complaintController.js';
const router = express.Router();
router.post('/', uploadSingle, createComplaint);
router.get('/', getComplaints);
router.get('/:id', getComplaintById);
router.patch('/:id/status', updateComplaintStatus);
export default router;
//# sourceMappingURL=complaints.js.map