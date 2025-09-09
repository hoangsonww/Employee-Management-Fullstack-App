import React, { useState, useEffect } from 'react';
import { 
  AppBar, Toolbar, Typography, Button, Box, IconButton, Drawer, List, 
  ListItem, ListItemText, Divider, Badge, Menu, MenuItem 
} from '@mui/material';
import { 
  Link, useLocation, useNavigate 
} from 'react-router-dom';
import { 
  Menu as MenuIcon, AdminPanelSettings, History, 
  ExpandMore, ExpandLess 
} from '@mui/icons-material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { authService } from '../services/apiService';

const Navbar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [adminMenuAnchor, setAdminMenuAnchor] = useState(null);
  const [adminExpanded, setAdminExpanded] = useState(false);

  // Check if screen width is below 1000px
  const isMobile = useMediaQuery('(max-width:1000px)');

  const isActive = path => currentPath === path;

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleAdminMenuOpen = (event) => {
    setAdminMenuAnchor(event.currentTarget);
  };

  const handleAdminMenuClose = () => {
    setAdminMenuAnchor(null);
  };

  const handleAdminExpandToggle = () => {
    setAdminExpanded(!adminExpanded);
  };

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem('token');
      const currentUser = authService.getCurrentUser();
      setIsLoggedIn(!!token);
      setUser(currentUser);
    };

    checkLoginStatus();
    const interval = setInterval(checkLoginStatus, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    authService.logout();
    setIsLoggedIn(false);
    setUser(null);
    navigate('/login');
  };

  const hasAdminAccess = () => {
    return user && (authService.hasRole('ADMIN') || authService.hasRole('HR'));
  };

  const drawerContent = (
    <Box sx={{ width: 250, backgroundColor: '#3f51b5', height: '100%', color: 'white' }} role="presentation">
      <List>
        <ListItem button component={Link} to="/" selected={isActive('/')} onClick={handleDrawerToggle}>
          <ListItemText primary="Home" sx={{ color: isActive('/') ? '#ff9800' : 'white' }} />
        </ListItem>
        {isLoggedIn && (
          <>
            <ListItem button component={Link} to="/dashboard" selected={isActive('/dashboard')} onClick={handleDrawerToggle}>
              <ListItemText primary="Dashboard" sx={{ color: isActive('/dashboard') ? '#ff9800' : 'white' }} />
            </ListItem>
            <ListItem button component={Link} to="/employees" selected={isActive('/employees')} onClick={handleDrawerToggle}>
              <ListItemText primary="Employees" sx={{ color: isActive('/employees') ? '#ff9800' : 'white' }} />
            </ListItem>
            <ListItem button component={Link} to="/departments" selected={isActive('/departments')} onClick={handleDrawerToggle}>
              <ListItemText primary="Departments" sx={{ color: isActive('/departments') ? '#ff9800' : 'white' }} />
            </ListItem>
            
            {/* Admin Section for Mobile */}
            {hasAdminAccess() && (
              <>
                <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.3)', my: 1 }} />
                <ListItem button onClick={handleAdminExpandToggle}>
                  <AdminPanelSettings sx={{ mr: 1 }} />
                  <ListItemText primary="Admin" sx={{ color: 'white' }} />
                  {adminExpanded ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                {adminExpanded && (
                  <>
                    <ListItem 
                      button 
                      component={Link} 
                      to="/admin" 
                      selected={isActive('/admin')} 
                      onClick={handleDrawerToggle}
                      sx={{ pl: 4 }}
                    >
                      <ListItemText primary="Role Management" sx={{ color: isActive('/admin') ? '#ff9800' : 'white' }} />
                    </ListItem>
                    <ListItem 
                      button 
                      component={Link} 
                      to="/audit-logs" 
                      selected={isActive('/audit-logs')} 
                      onClick={handleDrawerToggle}
                      sx={{ pl: 4 }}
                    >
                      <ListItemText primary="Audit Logs" sx={{ color: isActive('/audit-logs') ? '#ff9800' : 'white' }} />
                    </ListItem>
                  </>
                )}
                <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.3)', my: 1 }} />
              </>
            )}
            
            <ListItem button component={Link} to="/profile" selected={isActive('/profile')} onClick={handleDrawerToggle}>
              <ListItemText primary="Profile" sx={{ color: isActive('/profile') ? '#ff9800' : 'white' }} />
            </ListItem>
          </>
        )}
        
        <ListItem button onClick={isLoggedIn ? handleLogout : () => navigate('/login')}>
          <ListItemText
            primary={isLoggedIn ? 'Logout' : 'Login'}
            sx={{ color: isLoggedIn ? 'red' : isActive('/login') ? '#ff9800' : 'white' }}
          />
        </ListItem>
        
        {!isLoggedIn && (
          <ListItem button component={Link} to="/register" selected={isActive('/register')} onClick={handleDrawerToggle}>
            <ListItemText primary="Register" sx={{ color: isActive('/register') ? '#ff9800' : 'white' }} />
          </ListItem>
        )}
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

          {/* Render drawer icon for mobile view */}
          {isMobile ? (
            <IconButton color="inherit" edge="start" onClick={handleDrawerToggle}>
              <MenuIcon />
            </IconButton>
          ) : (
            // Render full menu for desktop view
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
                Home
              </Button>
              
              {isLoggedIn && (
                <>
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
                  
                  {/* Admin Menu for Desktop */}
                  {hasAdminAccess() && (
                    <>
                      <Button
                        onClick={handleAdminMenuOpen}
                        startIcon={<AdminPanelSettings />}
                        sx={{
                          fontSize: '1rem',
                          fontWeight: 500,
                          color: (isActive('/admin') || isActive('/audit-logs')) ? '#ff9800' : 'inherit',
                        }}
                      >
                        Admin
                      </Button>
                      <Menu
                        anchorEl={adminMenuAnchor}
                        open={Boolean(adminMenuAnchor)}
                        onClose={handleAdminMenuClose}
                      >
                        <MenuItem 
                          component={Link} 
                          to="/admin" 
                          onClick={handleAdminMenuClose}
                          sx={{ color: isActive('/admin') ? '#ff9800' : 'inherit' }}
                        >
                          <AdminPanelSettings sx={{ mr: 1 }} />
                          Role Management
                        </MenuItem>
                        <MenuItem 
                          component={Link} 
                          to="/audit-logs" 
                          onClick={handleAdminMenuClose}
                          sx={{ color: isActive('/audit-logs') ? '#ff9800' : 'inherit' }}
                        >
                          <History sx={{ mr: 1 }} />
                          Audit Logs
                        </MenuItem>
                      </Menu>
                    </>
                  )}
                  
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
                </>
              )}
              
              {/* User info and roles display */}
              {isLoggedIn && user && (
                <Box sx={{ display: 'flex', alignItems: 'center', ml: 1, mr: 1 }}>
                  <Typography variant="body2" sx={{ color: 'white', mr: 1 }}>
                    {user.username}
                  </Typography>
                  {user.roles && user.roles.length > 0 && (
                    <Badge 
                      badgeContent={user.roles.length} 
                      color="secondary"
                      sx={{ mr: 1 }}
                    >
                      <Typography variant="caption" sx={{ color: '#ff9800' }}>
                        {user.roles.includes('ADMIN') ? 'ADMIN' : user.roles[0]}
                      </Typography>
                    </Badge>
                  )}
                </Box>
              )}
              
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
                <>
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
                </>
              )}
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
