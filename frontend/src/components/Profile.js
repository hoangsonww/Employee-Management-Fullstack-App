import React, { useEffect, useState } from 'react';
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from 'react-router-dom';

const Profile = ({ theme }) => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem('token');
      if (token) {
        setIsLoggedIn(true);
      } else {
        navigate('/login', { replace: true }); // Redirect immediately if not logged in
      }
    };

    checkLoginStatus();
  }, [navigate]);

  if (!isLoggedIn) {
    return null; // Prevent rendering the profile page if not logged in
  }

  // Hardcoded profile data
  const profileData = {
    username: "John Doe",
    employeeCount: 150,
    departmentCount: 5,
    averageAge: 34.2,
    averageJobSatisfaction: "High",
  };

  // Hardcoded avatar image URL
  const avatarUrl = "/OIP.jpg";

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token
    navigate('/login'); // Redirect to login page
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "100vh",
        backgroundColor: theme === "dark" ? "#222" : "#f4f4f4",
        paddingTop: 8,
        paddingBottom: 20,
        transition: "background-color 0.3s ease",
      }}
    >
      {/* Welcome Message */}
      <Typography variant="h4" sx={{ textAlign: "center", marginBottom: 4 }}>
        Welcome, {profileData.username}!
      </Typography>

      {/* Profile Card */}
      <Box
        sx={{
          backgroundColor: theme === "dark" ? "#333" : "#fff",
          color: theme === "dark" ? "#fff" : "#000",
          padding: 4,
          borderRadius: 2,
          width: "400px",
          textAlign: "center",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          transition: "background-color 0.3s ease",
        }}
      >
        {/* Avatar Section */}
        <Box
          sx={{
            width: 150,
            height: 150,
            borderRadius: "50%",
            overflow: "hidden",
            margin: "0 auto 16px",
            border: "3px solid #3f51b5",
          }}
        >
          <img
            src={avatarUrl}
            alt="User Avatar"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </Box>

        {/* Profile Title */}
        <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
          Profile Information
        </Typography>

        {/* Username */}
        <Typography variant="body1" sx={{ mb: 1, fontSize: '16px' }}>
          <strong>Username:</strong> {profileData.username}
        </Typography>

        {/* Total Employees */}
        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>Total Employees:</strong> {profileData.employeeCount}
        </Typography>

        {/* Total Departments */}
        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>Departments:</strong> {profileData.departmentCount}
        </Typography>

        {/* Average Age */}
        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>Average Age:</strong> {profileData.averageAge}
        </Typography>

        {/* Job Satisfaction */}
        <Typography variant="body1" sx={{ mb: 1 }}>
          <strong>Job Satisfaction:</strong> {profileData.averageJobSatisfaction}
        </Typography>

        <div style={{ height: 20, borderBottom: '1px solid #ccc' }}></div>

        {/* Thank you message */}
        <Typography variant="body1" sx={{ mt: 2 }}>
          <strong>
            Thank you for using our platform today! 🚀
          </strong>
        </Typography>

        {/* Logout Button */}
        <Button
          variant="contained"
          color="secondary"
          sx={{ mt: 3 }}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );
};

export default Profile;
