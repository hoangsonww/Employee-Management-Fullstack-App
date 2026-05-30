import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Box, Typography, Paper, Stack } from '@mui/material';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import HomeIcon from '@mui/icons-material/Home';
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: { xs: 'calc(100vh - 220px)', md: 'calc(100vh - 260px)' },
        display: 'flex',
        flexDirection: 'column',
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
          textAlign: 'center',
          width: '100%',
          maxWidth: 560,
          px: { xs: 3, sm: 6 },
          py: { xs: 5, sm: 7 },
          borderRadius: 4,
          background: 'linear-gradient(135deg, #f7f9ff 0%, #eef2ff 100%)',
          border: '1px solid rgba(30, 60, 114, 0.08)',
          boxShadow: '0 25px 70px rgba(15, 23, 42, 0.12)',
        }}
      >
        {/* Decorative gradient blobs (match footer/landing language) */}
        <Box
          sx={{
            position: 'absolute',
            width: 200,
            height: 200,
            top: -70,
            right: -50,
            background: 'radial-gradient(circle, rgba(30, 60, 114, 0.18), transparent 60%)',
            filter: 'blur(2px)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            width: 170,
            height: 170,
            bottom: -55,
            left: -45,
            background: 'radial-gradient(circle, rgba(255, 152, 0, 0.18), transparent 60%)',
            filter: 'blur(2px)',
          }}
        />

        <Box sx={{ position: 'relative' }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 84,
              height: 84,
              mb: 2,
              borderRadius: '50%',
              color: 'white',
              background: 'linear-gradient(135deg, #1E3C72 0%, #2A5298 100%)',
              boxShadow: '0 12px 30px rgba(30, 60, 114, 0.35)',
            }}
          >
            <SearchOffIcon sx={{ fontSize: 44 }} />
          </Box>

          <Typography
            variant="h1"
            sx={{
              fontWeight: 800,
              lineHeight: 1,
              fontSize: { xs: '4.5rem', sm: '6rem' },
              background: 'linear-gradient(135deg, #1E3C72 0%, #2A5298 55%, #ff9800 130%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            404
          </Typography>

          <Typography variant="h5" sx={{ fontWeight: 700, color: '#0f172a', mt: 1 }}>
            Page not found
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mt: 1.5, mb: 4, maxWidth: 420, mx: 'auto' }}>
            The page you’re looking for doesn’t exist or may have moved. Check the URL, or head back to familiar ground.
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Button
              variant="contained"
              size="large"
              startIcon={<HomeIcon />}
              onClick={() => navigate('/')}
              sx={{
                px: 3,
                background: 'linear-gradient(135deg, #1E3C72 0%, #2A5298 100%)',
                boxShadow: '0 12px 30px rgba(30, 60, 114, 0.3)',
                '&:hover': { background: 'linear-gradient(135deg, #1a3566 0%, #244a8a 100%)' },
              }}
            >
              Go to Home
            </Button>
            <Button variant="outlined" size="large" color="primary" startIcon={<SpaceDashboardIcon />} onClick={() => navigate('/dashboard')} sx={{ px: 3 }}>
              Go to Dashboard
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
};

export default NotFoundPage;
