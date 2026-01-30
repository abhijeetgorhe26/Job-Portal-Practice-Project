import React, { useState, useEffect } from 'react';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Box,
  TextField,
  CircularProgress
} from '@mui/material';
import { Link } from 'react-router-dom';
import api from '../services/api';

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchJobs();
  }, [page, search]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = { page, limit: 10 };
      if (search) params.title = search;
      
      const response = await api.get('/jobs', { params });
      setJobs(response.data.data);
      setTotalPages(Math.ceil(response.data.total / 10));
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  if (loading && jobs.length === 0) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Available Jobs
        </Typography>
        
        <TextField
          fullWidth
          label="Search jobs by title"
          value={search}
          onChange={handleSearch}
          sx={{ mb: 3 }}
        />
        
        {jobs.length === 0 ? (
          <Typography variant="h6" align="center" sx={{ mt: 4 }}>
            No jobs found
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {jobs.map((job) => (
              <Grid item xs={12} md={6} key={job._id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {job.title}
                    </Typography>
                    <Typography color="textSecondary" gutterBottom>
                      {job.company}
                    </Typography>
                    <Typography variant="body2" paragraph>
                      {job.description.length > 150
                        ? `${job.description.substring(0, 150)}...`
                        : job.description}
                    </Typography>
                    {job.salary && (
                      <Typography variant="body2" color="primary" gutterBottom>
                        Salary: ${job.salary.toLocaleString()}
                      </Typography>
                    )}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                      <Button
                        component={Link}
                        to={`/jobs/${job._id}`}
                        variant="outlined"
                        size="small"
                      >
                        View Details
                      </Button>
                      <Button
                        component={Link}
                        to={`/jobs/${job._id}/apply`}
                        variant="contained"
                        size="small"
                      >
                        Apply Now
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
        
        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, gap: 2 }}>
            <Button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </Button>
            <Typography sx={{ alignSelf: 'center' }}>
              Page {page} of {totalPages}
            </Typography>
            <Button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default JobList;