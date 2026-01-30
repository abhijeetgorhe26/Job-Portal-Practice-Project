import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isEmployer } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
            Job Portal
          </Link>
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          {!user ? (
            <>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/register">
                Register
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/jobs">
                Jobs
              </Button>
              
              {isEmployer() && (
                <Button color="inherit" component={Link} to="/post-job">
                  Post Job
                </Button>
              )}
              
              <Button color="inherit" component={Link} to="/my-applications">
                My Applications
              </Button>
              
              <Typography variant="body1" sx={{ alignSelf: 'center' }}>
                {user.name} ({user.role})
              </Typography>
              
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;