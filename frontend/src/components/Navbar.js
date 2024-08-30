import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Determine if a link is active based on the current path
  const isActive = (path) => currentPath === path;

  return (
    <AppBar position="static" sx={{ backgroundColor: '#3f51b5', padding: '0.5rem 0' }}>
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'white',
            fontSize: '1.5rem',
            fontWeight: 600,
          }}
        >
          Employee Management System
        </Typography>
        <Box sx={{ display: 'flex', gap: '1rem' }}>
          <Button
            color={isActive('/') ? 'primary' : 'inherit'}
            component={Link}
            to="/"
            sx={{
              fontSize: '1rem',
              fontWeight: 500,
              color: isActive('/') ? '#ff9800' : 'inherit',
            }}
          >
            Dashboard
          </Button>
          <Button
            color={isActive('/employees') ? 'primary' : 'inherit'}
            component={Link}
            to="/employees"
            sx={{
              fontSize: '1rem',
              fontWeight: 500,
              color: isActive('/employees') ? '#ff9800' : 'inherit',
            }}
          >
            Employees
          </Button>
          <Button
            color={isActive('/departments') ? 'primary' : 'inherit'}
            component={Link}
            to="/departments"
            sx={{
              fontSize: '1rem',
              fontWeight: 500,
              color: isActive('/departments') ? '#ff9800' : 'inherit',
            }}
          >
            Departments
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
