import Job from '../models/Job.js';
import validator from 'validator';

// Create a job
export const createJob = async (req, res) => {
  try {
    const { title, company, description, email } = req.body;
    
    // Manual validation
    const errors = [];
    
    if (!title || title.trim().length < 5) {
      errors.push('Title must be at least 5 characters');
    }
    
    if (!company || company.trim().length < 2) {
      errors.push('Company name must be at least 2 characters');
    }
    
    if (!description || description.trim().length < 20) {
      errors.push('Description must be at least 20 characters');
    }
    
    if (email && !validator.isEmail(email)) {
      errors.push('Please provide a valid email');
    }
    
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        errors
      });
    }
    
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
};

// Get all jobs
// Get all jobs with pagination
export const getJobs = async (req, res) => {
  try {
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    
    // Build query
    let query = { isActive: true };
    
    // Search by title
    if (req.query.title) {
      query.title = { $regex: req.query.title, $options: 'i' };
    }
    
    // Search by company
    if (req.query.company) {
      query.company = { $regex: req.query.company, $options: 'i' };
    }

    // Execute query with pagination
    const jobs = await Job.find(query)
      .skip(startIndex)
      .limit(limit)
      .sort('-createdAt');

    // Get total count
    const total = await Job.countDocuments(query);

    // Pagination result
    const pagination = {};
    
    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }
    
    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.status(200).json({
      success: true,
      count: jobs.length,
      total,
      pagination,
      data: jobs
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Cannot get jobs'
    });
  }
};