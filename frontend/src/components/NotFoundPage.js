import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Box, Typography } from '@mui/material';

const NotFoundPage = () => {
  const navigate = useNavigate();

  // Handle redirection back to home or relevant page
  const handleGoHome = () => {
    navigate('/'); // Redirects to homepage, change the path if necessary
  };

  return (
    <Box
      sx={{
        textAlign: 'center',
        paddingTop: '4rem',
        paddingBottom: '4rem',
      }}
    >
      <Typography variant="h2" color="error" gutterBottom>
        404
      </Typography>
      <Typography variant="h5" gutterBottom>
        Oops! The page you're looking for doesn't exist.
      </Typography>
      <Typography variant="body1" paragraph>
        It seems the page you are trying to access is not available or you have typed the wrong URL.
      </Typography>
      <Button variant="contained" color="primary" onClick={handleGoHome}>
        Go Back to Home
      </Button>
    </Box>
  );
};

export default NotFoundPage;
