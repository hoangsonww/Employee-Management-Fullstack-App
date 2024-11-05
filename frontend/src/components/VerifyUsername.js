import React, { useState } from 'react';
import { TextField, Button, Card, CardContent, Typography, Box, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Correct useNavigate

const VerifyUsername = () => {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch(`https://employee-management-app-gdm5.onrender.com/verify-username/${username}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      setLoading(false);

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          navigate(`/reset-password?username=${username}`);
        }, 1000); // Redirect to reset password page after a short delay
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Username not found.');
      }
    } catch (err) {
      setLoading(false);
      setError('Something went wrong. Please try again later.');
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Card sx={{ width: '100%', maxWidth: 400, boxShadow: 3, borderRadius: 4, padding: 2, backgroundColor: '#fff' }}>
        <CardContent>
          <Typography variant="h5" component="h2" textAlign="center" sx={{ marginBottom: '1rem' }}>
            Verify Username
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField fullWidth label="Username" value={username} onChange={e => setUsername(e.target.value)} sx={{ marginBottom: '1rem' }} />
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
              </Box>
            ) : (
              <Button fullWidth variant="contained" color="primary" type="submit">
                Verify Username
              </Button>
            )}
            {error && (
              <Typography color="error" textAlign="center" sx={{ marginTop: '1rem' }}>
                {error}
              </Typography>
            )}
            {success && (
              <Typography color="primary" textAlign="center" sx={{ marginTop: '1rem' }}>
                Username verified! Redirecting to reset password...
              </Typography>
            )}
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default VerifyUsername;
