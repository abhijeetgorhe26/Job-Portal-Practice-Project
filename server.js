// import module
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'
// files 
import connectDB from './config/db.js';
import testRoutes from './routes/testRoutes.js'
import jobRoutes from './routes/jobRoutes.js'
import authRoutes from './routes/authRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import { authLimiter, apiLimiter } from './middleware/rateLimiter.js';



const app = express();
// middleware 
app.use(express.json());

// dotenv
dotenv.config();
const PORT = process.env.PORT;

app.use(cors({
  origin: 'http://localhost:5173', // Your React port
  credentials: true
}));


app.get('/', (req, res) => {
  res.send('Hello world from Abhijeet Gorhe Developing');
});
// API Documentation
app.get('/api-docs', (req, res) => {
  res.json({
    name: 'Job Portal API',
    version: '1.0.0',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        getMe: 'GET /api/auth/me'
      },
      jobs: {
        getAll: 'GET /api/jobs',
        create: 'POST /api/jobs (employer/admin only)'
      },
      applications: {
        apply: 'POST /api/jobs/:jobId/apply',
        myApplications: 'GET /api/my-applications',
        jobApplications: 'GET /api/jobs/:jobId/applications (employer/admin)',
        updateStatus: 'PUT /api/applications/:id/status (employer/admin)'
      }
    },
    queryParameters: {
      jobs: {
        page: 'Page number (default: 1)',
        limit: 'Items per page (default: 10)',
        title: 'Search by title',
        company: 'Search by company'
      }
    }
  });
});


//  routes
app.use('/api/test', testRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', applicationRoutes);
app.use('/api/test', testRoutes);

// Apply rate limiting
//app.use('/api/auth', authLimiter);
//app.use('/api', apiLimiter);


// connect to database
connectDB();
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
