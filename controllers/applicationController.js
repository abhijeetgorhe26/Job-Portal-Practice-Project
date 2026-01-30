import Application from '../models/Application.js';
import Job from '../models/Job.js';

// @desc    Apply for a job
// @route   POST /api/jobs/:jobId/apply
// @access  Private (users only)
export const applyForJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { resumeUrl, coverLetter } = req.body;
    const applicantId = req.user.id;

    // 1. Check if job exists and is active
    const job = await Job.findById(jobId);
    if (!job || !job.isActive) {
      return res.status(404).json({
        success: false,
        error: 'Job not found or not active'
      });
    }

    // 2. Check if user already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: applicantId
    });

    if (existingApplication) {
      return res.status(409).json({
        success: false,
        error: 'You have already applied for this job'
      });
    }

    // 3. Validate resume URL
    if (!resumeUrl || resumeUrl.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Resume URL is required'
      });
    }

    // 4. Create application
    const application = await Application.create({
      job: jobId,
      applicant: applicantId,
      resumeUrl: resumeUrl.trim(),
      coverLetter: coverLetter || '',
      status: 'pending'
    });

    // 5. Populate job and applicant details
    await application.populate('job', 'title company');
    await application.populate('applicant', 'name email');

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: application
    });

  } catch (error) {
    console.error('Apply job error:', error);
    
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        error: 'You have already applied for this job'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Application failed'
    });
  }
};

// @desc    Get user's applications
// @route   GET /api/applications/my-applications
// @access  Private
export const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ 
      applicant: req.user.id 
    })
    .populate('job', 'title company description')
    .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get applications'
    });
  }
};

// Add these new functions to your existing file

// @desc    Get applications for a specific job (employer view)
// @route   GET /api/jobs/:jobId/applications
// @access  Private (employer/admin only)
export const getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Check if job exists and belongs to employer
    const job = await Job.findById(jobId);
    
    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Job not found'
      });
    }

    // If user is not admin, check if they own the job
    if (userRole !== 'admin') {
      // Note: You might want to add a 'postedBy' field to Job model later
      // For now, we'll allow any employer to see any job's applications
    }

    const applications = await Application.find({ job: jobId })
      .populate('applicant', 'name email')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });

  } catch (error) {
    console.error('Get job applications error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get applications'
    });
  }
};

// @desc    Update application status (employer/admin)
// @route   PUT /api/applications/:applicationId/status
// @access  Private (employer/admin only)
export const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;
    const userRole = req.user.role;

    // Validate status
    const validStatuses = ['pending', 'reviewed', 'accepted', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status. Must be: pending, reviewed, accepted, rejected'
      });
    }

    const application = await Application.findById(applicationId)
      .populate('job', 'title company')
      .populate('applicant', 'name email');

    if (!application) {
      return res.status(404).json({
        success: false,
        error: 'Application not found'
      });
    }

    // Update status
    application.status = status;
    await application.save();

    res.status(200).json({
      success: true,
      message: `Application status updated to ${status}`,
      data: application
    });

  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update status'
    });
  }
};

// @desc    Get single application
// @route   GET /api/applications/:applicationId
// @access  Private
export const getApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const application = await Application.findById(applicationId)
      .populate('job', 'title company description')
      .populate('applicant', 'name email');

    if (!application) {
      return res.status(404).json({
        success: false,
        error: 'Application not found'
      });
    }

    // Check permissions
    const isApplicant = application.applicant._id.toString() === userId;
    const isEmployerOrAdmin = ['employer', 'admin'].includes(userRole);

    if (!isApplicant && !isEmployerOrAdmin) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to view this application'
      });
    }

    res.status(200).json({
      success: true,
      data: application
    });

  } catch (error) {
    console.error('Get application error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get application'
    });
  }
};