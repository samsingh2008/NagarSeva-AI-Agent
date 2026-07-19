import express from 'express';
import complaintsRouter from './complaints.js';
import safetyRouter from './safety.js';

const router = express.Router();

router.use('/complaints', complaintsRouter);
router.use('/safety', safetyRouter);

export default router;
