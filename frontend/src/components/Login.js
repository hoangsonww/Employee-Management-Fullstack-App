import React, { useState } from 'react';
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  InputAdornment,
  Stack,
  Alert,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import { setSession } from '../services/authService';
import { loginWithPasskey, getApiErrorMessage } from '../services/passkeyService';
import { isWebAuthnSupported, describeWebAuthnError } from '../utils/webauthn';
import { extractFetchError } from '../utils/apiError';
import { notifySuccess, notifyError } from '../utils/toast';
import LoadingOverlay from './LoadingOverlay';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passkeyLoading, setPasskeyLoading] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = location.state?.from;
  const destinationLabel = redirectPath ? 'Continue' : 'Go to dashboard';
  const passkeySupported = isWebAuthnSupported();

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('https://employee-management-app-gdm5.onrender.com/authenticate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setLoading(false);
        setSession(data.token, username);
        notifySuccess(`Welcome back, ${username}! You're signed in.`);
        setSuccessOpen(true);
      } else {
        setLoading(false);
        const message = await extractFetchError(response, 'Invalid username or password. Please try again.');
        notifyError(message);
      }
    } catch (err) {
      setLoading(false);
      notifyError('We could not reach the server (it may be waking up). Please try again in a moment.');
    }
  };

  const handlePasskeyLogin = async () => {
    setPasskeyLoading(true);
    try {
      const data = await loginWithPasskey(username.trim() || undefined);
      setSession(data.token, data.username);
      setUsername(data.username || username);
      notifySuccess(`Welcome back, ${data.username || username}! Signed in with your passkey.`);
      setSuccessOpen(true);
    } catch (err) {
      const message =
        err && err.name && err.name.endsWith('Error') && !err.response
          ? describeWebAuthnError(err)
          : getApiErrorMessage(err, 'We could not sign you in with a passkey. Please try again.');
      notifyError(message);
    } finally {
      setPasskeyLoading(false);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSuccessContinue = () => {
    const target = redirectPath || '/dashboard';
    setSuccessOpen(false);
    navigate(target);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1E3C72 0%, #2A5298 100%)',
        padding: 2,
        borderRadius: 6,
      }}
    >
      <Card
        sx={{
          width: '100%',
          maxWidth: 900,
          boxShadow: '0 25px 70px rgba(15, 23, 42, 0.25)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: 4,
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1.1fr 0.9fr' },
          backdropFilter: 'blur(6px)',
        }}
      >
        <Box
          sx={{
            background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
            color: '#1a1a1a',
            padding: { xs: 3, md: 5 },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 2,
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Welcome back
          </Typography>
          <Typography>Sign in to access your dashboard, manage employees, and keep your organization humming.</Typography>
          <Stack spacing={1}>
            <Typography sx={{ fontWeight: 600 }}>Why log in?</Typography>
            <Typography variant="body2">• Securely access the insights-rich dashboard.</Typography>
            <Typography variant="body2">• Manage teams, departments, and updates in one spot.</Typography>
            <Typography variant="body2">• Pick up where you left off with your saved session.</Typography>
          </Stack>
        </Box>
        <CardContent
          sx={{
            padding: { xs: 3, md: 4 },
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <Typography variant="h5" component="h2" textAlign="center" sx={{ marginBottom: '0.5rem', fontWeight: 700 }}>
            Login
          </Typography>
          {redirectPath && (
            <Alert severity="info" sx={{ marginBottom: '1rem' }}>
              Please log in to continue to <strong>{redirectPath}</strong>.
            </Alert>
          )}
          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                fullWidth
                label="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
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
              <Button fullWidth variant="contained" color="primary" type="submit" disabled={loading || passkeyLoading} sx={{ paddingY: 1.2 }}>
                {loading ? 'Signing in…' : 'Login'}
              </Button>
              {passkeySupported && (
                <>
                  <Divider sx={{ color: 'text.secondary' }}>or</Divider>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="primary"
                    startIcon={<FingerprintIcon />}
                    onClick={handlePasskeyLogin}
                    disabled={loading || passkeyLoading}
                    sx={{
                      paddingY: 1.2,
                      '&:hover': {
                        backgroundColor: 'primary.main',
                        borderColor: 'primary.main',
                        color: '#fff',
                      },
                      '&:hover .MuiButton-startIcon': {
                        color: '#fff',
                      },
                    }}
                  >
                    {passkeyLoading ? 'Waiting for your device…' : 'Sign in with a passkey'}
                  </Button>
                </>
              )}
              <Divider />
              <Stack spacing={1} alignItems="center">
                <Typography variant="body2">
                  Don't have an account?{' '}
                  <Button color="primary" component="a" href="/register" size="small">
                    Register
                  </Button>
                </Typography>
                <Typography variant="body2">
                  Forgot your password?{' '}
                  <Button color="primary" component="a" href="/verify-username" size="small">
                    Reset Password
                  </Button>
                </Typography>
              </Stack>
            </Stack>
          </form>
        </CardContent>
      </Card>

      {(loading || passkeyLoading) && <LoadingOverlay message={passkeyLoading ? 'Verifying your passkey…' : 'Signing you in…'} />}

      <Dialog open={successOpen} onClose={handleSuccessContinue} aria-labelledby="login-success-title">
        <DialogTitle id="login-success-title">Login successful</DialogTitle>
        <DialogContent>
          <Typography variant="body1">Welcome back, {username || 'there'}! Ready to continue?</Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleSuccessContinue}>
            {destinationLabel}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Login;
