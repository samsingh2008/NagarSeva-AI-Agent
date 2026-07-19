import express from 'express';
import { getSafetyHeatmap } from '../controllers/complaintController.js';

const router = express.Router();

router.get('/heatmap', getSafetyHeatmap);

export default router;
