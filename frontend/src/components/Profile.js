import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, CircularProgress, Snackbar, Alert, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getAllEmployees } from '../services/employeeService';
import { getAllDepartments } from '../services/departmentService';

const Profile = ({ theme }) => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [employeeCount, setEmployeeCount] = useState(0);
  const [departmentCount, setDepartmentCount] = useState(0);
  const [averageAge, setAverageAge] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showSnackbar, setShowSnackbar] = useState(false);

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem('token');
      if (token) {
        setIsLoggedIn(true);
      } else {
        setShowSnackbar(true); // Show the snackbar notification
      }
    };

    checkLoginStatus();
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const employees = await getAllEmployees();
        const departments = await getAllDepartments();
        setEmployeeCount(employees.length);
        setDepartmentCount(departments.length);

        const totalAge = employees.reduce((sum, emp) => sum + emp.age, 0);
        const avgAge = employees.length ? (totalAge / employees.length).toFixed(1) : 0;
        setAverageAge(avgAge);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
    navigate('/login', { replace: true });
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  if (!isLoggedIn) {
    return (
      <>
        <Snackbar open={showSnackbar} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} sx={{ mt: 9 }}>
          <Alert onClose={handleCloseSnackbar} severity="warning" sx={{ width: '100%' }}>
            You must be logged in to view your profile.{' '}
            <span
              onClick={handleLoginRedirect}
              style={{
                color: '#3f51b5',
                textDecoration: 'underline',
                cursor: 'pointer',
                transition: 'color 0.1s',
              }}
              onMouseEnter={e => (e.target.style.color = '#f57c00')}
              onMouseLeave={e => (e.target.style.color = '#3f51b5')}
            >
              Login
            </span>
          </Alert>
        </Snackbar>
        <div style={{ height: 20 }}></div>
      </>
    );
  }

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: theme === 'dark' ? '#222' : '#f4f4f4',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const profileData = {
    username: localStorage.getItem('EMSusername') || 'John Doe',
    employeeCount,
    departmentCount,
    averageAge,
    averageJobSatisfaction: 'High',
  };

  const avatarUrl = '/OIP.jpg';

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: theme === 'dark' ? '#222' : '#f4f4f4',
        paddingTop: 8,
        paddingBottom: 20,
        transition: 'background-color 0.3s ease',
      }}
    >
      <Typography variant="h4" sx={{ textAlign: 'center', marginBottom: 4 }}>
        Welcome, {profileData.username}!
      </Typography>

      <Box
        sx={{
          backgroundColor: theme === 'dark' ? '#333' : '#fff',
          color: theme === 'dark' ? '#fff' : '#000',
          padding: 4,
          borderRadius: 2,
          width: '400px',
          textAlign: 'center',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
          transition: 'background-color 0.3s ease',
        }}
      >
        <Box
          sx={{
            width: 150,
            height: 150,
            borderRadius: '50%',
            overflow: 'hidden',
            margin: '0 auto 16px',
            border: '3px solid #3f51b5',
          }}
        >
          <img src={avatarUrl} alt="User Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </Box>

        <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
          Profile Information
        </Typography>

        <Typography variant="body1" sx={{ mb: 1, fontSize: '16px' }}>
          <strong>Username:</strong> {profileData.username}
        </Typography>

        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>Total Employees:</strong> {profileData.employeeCount}
        </Typography>

        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>Departments:</strong> {profileData.departmentCount}
        </Typography>

        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>Average Age:</strong> {profileData.averageAge}
        </Typography>

        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>Job Satisfaction:</strong> {profileData.averageJobSatisfaction}
        </Typography>

        <div style={{ height: 20, borderBottom: '1px solid #ccc' }}></div>

        <Typography variant="body1" sx={{ mt: 2 }}>
          <strong>Thank you for using our platform today! 🚀</strong>
        </Typography>

        <Button variant="contained" color="secondary" sx={{ mt: 3 }} onClick={handleLogout}>
          Logout
        </Button>
      </Box>
    </Box>
  );
};

export default Profile;
