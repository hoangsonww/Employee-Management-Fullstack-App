import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';

const Navbar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate(); // To navigate after logout
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const isActive = (path) => currentPath === path;

  // Function to toggle the drawer in mobile view
  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  // Check if user is logged in by checking for token in localStorage every 2 seconds
  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token); // Set logged-in state if token is present
    };

    checkLoginStatus(); // Check initially
    const interval = setInterval(checkLoginStatus, 2000); // Check every 2 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token
    setIsLoggedIn(false); // Update state to reflect logout
    navigate('/login'); // Redirect to login page
  };

  const drawerContent = (
    <Box sx={{ width: 250, backgroundColor: '#3f51b5', height: '100%', color: 'white' }} role="presentation">
      <List>
        <ListItem button component={Link} to="/" selected={isActive('/')}>
          <ListItemText primary="Home" sx={{ color: isActive('/') ? '#ff9800' : 'white' }} />
        </ListItem>
        <ListItem button component={Link} to="/dashboard" selected={isActive('/dashboard')}>
          <ListItemText primary="Dashboard" sx={{ color: isActive('/dashboard') ? '#ff9800' : 'white' }} />
        </ListItem>
        <ListItem button component={Link} to="/employees" selected={isActive('/employees')}>
          <ListItemText primary="Employees" sx={{ color: isActive('/employees') ? '#ff9800' : 'white' }} />
        </ListItem>
        <ListItem button component={Link} to="/departments" selected={isActive('/departments')}>
          <ListItemText primary="Departments" sx={{ color: isActive('/departments') ? '#ff9800' : 'white' }} />
        </ListItem>
        <ListItem button component={Link} to="/login" selected={isActive('/login')}>
          <ListItemText
            primary={isLoggedIn ? 'Logout' : 'Login'}
            sx={{ color: isLoggedIn ? 'red' : isActive('/login') ? '#ff9800' : 'white' }}
            onClick={isLoggedIn ? handleLogout : null}
          />
        </ListItem>
        <ListItem button component={Link} to="/register" selected={isActive('/register')}>
          <ListItemText primary="Register" sx={{ color: isActive('/register') ? '#ff9800' : 'white' }} />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
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

          {/* Menu Icon Button for mobile view */}
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton color="inherit" edge="start" onClick={handleDrawerToggle}>
              <MenuIcon />
            </IconButton>
          </Box>

          {/* Desktop View Buttons */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: '1rem' }}>
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
              Home
            </Button>
            <Button
              color={isActive('/dashboard') ? 'primary' : 'inherit'}
              component={Link}
              to="/dashboard"
              sx={{
                fontSize: '1rem',
                fontWeight: 500,
                color: isActive('/dashboard') ? '#ff9800' : 'inherit',
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
            {/* Conditional Login/Logout Button */}
            {isLoggedIn ? (
              <Button
                onClick={handleLogout}
                sx={{
                  fontSize: '1rem',
                  fontWeight: 500,
                  color: 'red', // Make logout button red
                }}
              >
                Logout
              </Button>
            ) : (
              <Button
                color={isActive('/login') ? 'primary' : 'inherit'}
                component={Link}
                to="/login"
                sx={{
                  fontSize: '1rem',
                  fontWeight: 500,
                  color: isActive('/login') ? '#ff9800' : 'inherit',
                }}
              >
                Login
              </Button>
            )}

            {/* Register Button */}
            <Button
              color={isActive('/register') ? 'primary' : 'inherit'}
              component={Link}
              to="/register"
              sx={{
                fontSize: '1rem',
                fontWeight: 500,
                color: isActive('/register') ? '#ff9800' : 'inherit',
              }}
            >
              Register
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer for mobile view */}
      <Drawer anchor="left" open={drawerOpen} onClose={handleDrawerToggle}>
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Navbar;
