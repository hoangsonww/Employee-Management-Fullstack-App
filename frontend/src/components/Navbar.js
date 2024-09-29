import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Drawer, List, ListItem, ListItemText } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';

const Navbar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isActive = path => currentPath === path;

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const drawerContent = (
    <Box sx={{ width: 250 }} role="presentation" onClick={handleDrawerToggle} onKeyDown={handleDrawerToggle}>
      <List>
        <ListItem button component={Link} to="/" selected={isActive('/')}>
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem button component={Link} to="/dashboard" selected={isActive('/')}>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button component={Link} to="/employees" selected={isActive('/employees')}>
          <ListItemText primary="Employees" />
        </ListItem>
        <ListItem button component={Link} to="/departments" selected={isActive('/departments')}>
          <ListItemText primary="Departments" />
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
