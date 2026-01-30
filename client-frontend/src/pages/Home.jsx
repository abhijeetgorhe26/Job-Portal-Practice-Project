import React from 'react';
import { Container, Typography, Button, Box, Grid, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import WorkIcon from '@mui/icons-material/Work';
import BusinessIcon from '@mui/icons-material/Business';
import SearchIcon from '@mui/icons-material/Search';

const Home = () => {
  return (
    <Container>
      {/* Hero Section */}
      <Box sx={{ 
        textAlign: 'center', 
        py: 8,
        background: 'linear-gradient(135deg, #1976d2 0%, #21a1f1 100%)',
        borderRadius: 2,
        color: 'white',
        mb: 6
      }}>
        <Typography variant="h2" gutterBottom>
          Find Your Dream Job
        </Typography>
        <Typography variant="h5" gutterBottom sx={{ mb: 4 }}>
          Connect with top employers and discover opportunities
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            component={Link}
            to="/jobs"
            sx={{ px: 4 }}
          >
            Browse Jobs
          </Button>
          <Button
            variant="outlined"
            color="inherit"
            size="large"
            component={Link}
            to="/register"
            sx={{ px: 4 }}
          >
            Sign Up
          </Button>
        </Box>
      </Box>

      {/* Features */}
      <Grid container spacing={4} sx={{ mb: 6 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
            <WorkIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              For Job Seekers
            </Typography>
            <Typography>
              Find relevant job opportunities, apply with one click, and track your applications.
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
            <BusinessIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              For Employers
            </Typography>
            <Typography>
              Post job listings, manage applications, and find the perfect candidates.
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
            <SearchIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Easy Search
            </Typography>
            <Typography>
              Advanced search filters to find exactly what you're looking for.
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* CTA */}
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Ready to get started?
        </Typography>
        <Typography variant="h6" color="textSecondary" paragraph>
          Join thousands of professionals and companies
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          component={Link}
          to="/register"
          sx={{ px: 6, py: 1.5 }}
        >
          Get Started Now
        </Button>
      </Box>
    </Container>
  );
};

export default Home;