import React, { useState, useEffect } from 'react';
import { TextField, Button, Paper, Typography, Box, CircularProgress, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import LockResetIcon from '@mui/icons-material/LockReset';
import { useNavigate, useLocation } from 'react-router-dom';
import { extractFetchError } from '../utils/apiError';
import { notifySuccess, notifyError, notifyWarning } from '../utils/toast';

const ResetPassword = () => {
  const [username, setUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Get the username from the query params if available
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const usernameFromQuery = queryParams.get('username');
    if (usernameFromQuery) {
      setUsername(usernameFromQuery);
    }
  }, [location]);

  const handleSubmit = async e => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      notifyWarning('Those passwords do not match. Please re-enter them.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('https://employee-management-app-gdm5.onrender.com/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, newPassword }),
      });

      setLoading(false);

      if (response.ok) {
        notifySuccess('Password reset successfully! Redirecting you to sign in…');
        setTimeout(() => {
          navigate('/login');
        }, 2000); // Redirect to login page after success
      } else {
        const message = await extractFetchError(response, 'We could not reset your password. Please try again.');
        notifyError(message);
      }
    } catch (err) {
      setLoading(false);
      notifyError('We could not reach the server (it may be waking up). Please try again in a moment.');
    }
  };

  const handleToggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Box
      sx={{
        minHeight: { xs: 'calc(100vh - 220px)', md: 'calc(100vh - 260px)' },
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        px: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          position: 'relative',
          overflow: 'hidden',
          width: '100%',
          maxWidth: 440,
          px: { xs: 3, sm: 5 },
          py: { xs: 4, sm: 5 },
          borderRadius: 4,
          background: 'linear-gradient(135deg, #f7f9ff 0%, #eef2ff 100%)',
          border: '1px solid rgba(30, 60, 114, 0.08)',
          boxShadow: '0 25px 70px rgba(15, 23, 42, 0.12)',
        }}
      >
        {/* Decorative gradient blobs (match app theme) */}
        <Box
          sx={{
            position: 'absolute',
            width: 190,
            height: 190,
            top: -65,
            right: -45,
            background: 'radial-gradient(circle, rgba(30, 60, 114, 0.16), transparent 60%)',
            filter: 'blur(2px)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            width: 160,
            height: 160,
            bottom: -50,
            left: -40,
            background: 'radial-gradient(circle, rgba(255, 152, 0, 0.16), transparent 60%)',
            filter: 'blur(2px)',
          }}
        />

        <Box sx={{ position: 'relative' }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 64,
                height: 64,
                mb: 1.5,
                borderRadius: '50%',
                color: 'white',
                background: 'linear-gradient(135deg, #1E3C72 0%, #2A5298 100%)',
                boxShadow: '0 12px 30px rgba(30, 60, 114, 0.35)',
              }}
            >
              <LockResetIcon sx={{ fontSize: 34 }} />
            </Box>
            <Typography variant="h5" component="h2" sx={{ fontWeight: 700, color: '#0f172a' }}>
              Reset Password
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
              Choose a new password for your account.
            </Typography>
          </Box>
          <form onSubmit={handleSubmit}>
            <TextField fullWidth label="Username" value={username} onChange={e => setUsername(e.target.value)} disabled sx={{ marginBottom: '1rem' }} />
            <TextField
              fullWidth
              label="New Password"
              type={showNewPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              sx={{ marginBottom: '1rem' }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton aria-label="toggle password visibility" onClick={handleToggleNewPasswordVisibility} edge="end">
                      {showNewPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Confirm New Password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              sx={{ marginBottom: '1rem' }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton aria-label="toggle confirm password visibility" onClick={handleToggleConfirmPasswordVisibility} edge="end">
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
              </Box>
            ) : (
              <Button
                fullWidth
                variant="contained"
                type="submit"
                size="large"
                sx={{
                  background: 'linear-gradient(135deg, #1E3C72 0%, #2A5298 100%)',
                  boxShadow: '0 12px 30px rgba(30, 60, 114, 0.3)',
                  '&:hover': { background: 'linear-gradient(135deg, #1a3566 0%, #244a8a 100%)' },
                }}
              >
                Reset Password
              </Button>
            )}
          </form>
        </Box>
      </Paper>
    </Box>
  );
};

export default ResetPassword;
