import express from 'express';
import Job from '../models/Job.js';

const router = express.Router();

// POST /api/test/job
router.post('/job', async (req, res) => {
  try {
    const job = await Job.create(req.body);
    res.status(201).json({
      success: true,
      data: job
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        errors
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// GET /api/test
router.get('/', (req, res) => {
  res.json({
    message: 'Test routes working - ES6',
    endpoints: {
      testJob: 'POST /api/test/job'
    }
  });
});

export default router;