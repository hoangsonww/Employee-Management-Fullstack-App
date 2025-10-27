import React, { useState } from 'react';
import { TextField, Button, Card, CardContent, Typography, Box, CircularProgress, IconButton, InputAdornment, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { authService } from '../services/apiService';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authService.login({ username, password });
      setLoading(false);

      if (response.token) {
        alert(`Login successful. Welcome${response.username ? ', ' + response.username : ''}!`);
        navigate('/dashboard');
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (err) {
      setLoading(false);
      console.error('Login error:', err);
      
      if (err.response?.status === 401) {
        setError('Invalid credentials. Please try again.');
      } else if (err.response?.status === 403) {
        setError('Access denied. Your account may be disabled.');
      } else {
        setError('Login failed. Server may be unavailable. Please try again later.');
      }
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Card sx={{ width: '100%', maxWidth: 400, boxShadow: 3, borderRadius: 4, padding: 2, backgroundColor: '#fff' }}>
        <CardContent>
          <Typography variant="h5" component="h2" textAlign="center" sx={{ marginBottom: '1rem' }}>
            Login
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              sx={{ marginBottom: '1rem' }}
              InputProps={{
                style: {
                  fontFamily: 'Poppins, sans-serif',
                },
              }}
            />
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              sx={{ marginBottom: '1rem' }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton aria-label="toggle password visibility" onClick={handleTogglePasswordVisibility} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
                style: {
                  fontFamily: 'Poppins, sans-serif',
                },
              }}
            />
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
              </Box>
            ) : (
              <Button fullWidth variant="contained" color="primary" type="submit">
                Login
              </Button>
            )}
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
            )}
            <Typography textAlign="center" sx={{ marginTop: '1rem' }}>
              Don't have an account?{' '}
              <Button color="primary" component="a" href="/register">
                Register
              </Button>
            </Typography>
            <Typography textAlign="center" sx={{ marginTop: '0.5rem' }}>
              Forgot your password?{' '}
              <Button color="primary" component="a" href="/verify-username">
                Reset Password
              </Button>
            </Typography>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;
