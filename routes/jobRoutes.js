import express from 'express';
import { createJob, getJobs } from '../controllers/jobController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// GET /api/jobs - Get all jobs (public)
router.get('/', getJobs);

// POST /api/jobs - Create a job (protected, employers only)
router.post('/', protect, authorize('employer', 'admin'), createJob);

export default router;