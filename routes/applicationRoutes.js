import express from 'express';
import { 
  applyForJob, 
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
  getApplication
} from '../controllers/applicationController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Apply for a specific job
router.post('/jobs/:jobId/apply', protect, applyForJob);

// Get applications for a specific job (employer view)
router.get('/jobs/:jobId/applications', protect, authorize('employer', 'admin'), getJobApplications);

// Get user's applications
router.get('/my-applications', protect, getMyApplications);

// Get single application
router.get('/applications/:applicationId', protect, getApplication);

// Update application status
router.put('/applications/:applicationId/status', protect, authorize('employer', 'admin'), updateApplicationStatus);

export default router;