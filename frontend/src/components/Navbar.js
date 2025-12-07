import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Drawer, List, ListItem, ListItemText } from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import useMediaQuery from '@mui/material/useMediaQuery';

const Navbar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if screen width is below 1000px
  const isMobile = useMediaQuery('(max-width:1000px)');

  const isActive = path => currentPath === path;

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    };

    checkLoginStatus();
    const interval = setInterval(checkLoginStatus, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('EMSusername');
    setIsLoggedIn(false);
    navigate('/login');
  };

  const drawerContent = (
    <Box sx={{ width: 250, backgroundColor: '#3f51b5', height: '100%', color: 'white' }} role="presentation">
      <List>
        <ListItem button component={Link} to="/" selected={isActive('/')} onClick={handleDrawerToggle}>
          <ListItemText primary="Home" sx={{ color: isActive('/') ? '#ff9800' : 'white' }} />
        </ListItem>
        <ListItem button component={Link} to="/dashboard" selected={isActive('/dashboard')} onClick={handleDrawerToggle}>
          <ListItemText primary="Dashboard" sx={{ color: isActive('/dashboard') ? '#ff9800' : 'white' }} />
        </ListItem>
        <ListItem button component={Link} to="/employees" selected={isActive('/employees')} onClick={handleDrawerToggle}>
          <ListItemText primary="Employees" sx={{ color: isActive('/employees') ? '#ff9800' : 'white' }} />
        </ListItem>
        <ListItem button component={Link} to="/departments" selected={isActive('/departments')} onClick={handleDrawerToggle}>
          <ListItemText primary="Departments" sx={{ color: isActive('/departments') ? '#ff9800' : 'white' }} />
        </ListItem>
        <ListItem button component={Link} to="/profile" selected={isActive('/profile')} onClick={handleDrawerToggle}>
          <ListItemText primary="Profile" sx={{ color: isActive('/profile') ? '#ff9800' : 'white' }} />
        </ListItem>
        <ListItem button component={Link} to="/login" selected={isActive('/login')} onClick={handleDrawerToggle}>
          <ListItemText
            primary={isLoggedIn ? 'Logout' : 'Login'}
            sx={{ color: isLoggedIn ? 'red' : isActive('/login') ? '#ff9800' : 'white' }}
            onClick={isLoggedIn ? handleLogout : null}
          />
        </ListItem>
        <ListItem button component={Link} to="/register" selected={isActive('/register')} onClick={handleDrawerToggle}>
          <ListItemText primary="Register" sx={{ color: isActive('/register') ? '#ff9800' : 'white' }} />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="static"
        sx={{
          background: 'linear-gradient(135deg, #1E3C72 0%, #2A5298 100%)',
          padding: '0.5rem 0',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          borderRadius: 0,
        }}
      >
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

          {/* Render drawer icon for mobile view */}
          {isMobile ? (
            <IconButton color="inherit" edge="start" onClick={handleDrawerToggle}>
              <MenuIcon />
            </IconButton>
          ) : (
            // Render full menu for desktop view
            <Box sx={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
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
              <Button
                color={isActive('/profile') ? 'primary' : 'inherit'}
                component={Link}
                to="/profile"
                sx={{
                  fontSize: '1rem',
                  fontWeight: 500,
                  color: isActive('/profile') ? '#ff9800' : 'inherit',
                }}
              >
                Profile
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
          )}
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
