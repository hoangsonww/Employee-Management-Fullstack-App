import React from "react";
import { Box, Typography, Button } from "@mui/material";

const Profile = ({ theme }) => {
  // Hardcoded profile data
  const profileData = {
    username: "John Doe",
    employeeCount: 150,
    departmentCount: 5,
    averageAge: 34.2,
    averageJobSatisfaction: "High",
  };

  // Hardcoded avatar image URL
  const avatarUrl = "/OIP.jpg"; // Replace with actual image path or URL

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
            border: "3px solid #f57c00",
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
        <Typography variant="h6" sx={{ mb: 1 }}>
          <strong>Username:</strong> {profileData.username}
        </Typography>

        {/* Total Employees */}
        <Typography variant="h6" sx={{ mb: 1 }}>
          <strong>Total Employees:</strong> {profileData.employeeCount}
        </Typography>

        {/* Total Departments */}
        <Typography variant="h6" sx={{ mb: 1 }}>
          <strong>Departments:</strong> {profileData.departmentCount}
        </Typography>

        {/* Average Age */}
        <Typography variant="h6" sx={{ mb: 1 }}>
          <strong>Average Age:</strong> {profileData.averageAge}
        </Typography>

        {/* Job Satisfaction */}
        <Typography variant="h6" sx={{ mb: 1 }}>
          <strong>Job Satisfaction:</strong> {profileData.averageJobSatisfaction}
        </Typography>

        {/* Logout Button */}
        <Button
          variant="contained"
          color="secondary"
          sx={{ mt: 3 }}
          onClick={() => {
            localStorage.removeItem("userId");
            window.location.reload();
          }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );
};

export default Profile;
