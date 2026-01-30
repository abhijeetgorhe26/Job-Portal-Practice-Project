import mongoose from 'mongoose';
import validator from 'validator';

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true,
    minlength: [5, 'Title must be at least 5 characters'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  company: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    maxlength: [50, 'Company name cannot exceed 50 characters']
  },
  description: {
    type: String,
    required: [true, 'Job description is required'],
    minlength: [20, 'Description must be at least 20 characters']
  },
  email: {
    type: String,
    validate: {
      validator: (value) => validator.isEmail(value),
      message: 'Please provide a valid email'
    }
  },
  salary: {
    type: Number,
    min: [0, 'Salary cannot be negative']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Job = mongoose.model('Job', jobSchema);
export default Job;