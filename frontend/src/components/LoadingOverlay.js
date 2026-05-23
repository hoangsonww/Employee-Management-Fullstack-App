import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography, Tooltip, IconButton, Fade, Stack } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const DEFAULT_TIP_DELAY_MS = 4000;

const tooltipContent = (
  <Box sx={{ p: 0.5, maxWidth: 280 }}>
    <Typography variant="body2" sx={{ fontWeight: 700, mb: 0.5 }}>
      Why is this slow?
    </Typography>
    <Typography variant="caption" sx={{ display: 'block', lineHeight: 1.55 }}>
      Our backend runs on Render's free tier (512&nbsp;MB RAM, 0.1 CPU). When it has been idle the instance spins down, and a cold start typically takes 30–60&nbsp;seconds. Once it is warm, requests are much faster.
    </Typography>
  </Box>
);

const LoadingOverlay = ({ message = 'Loading…', tipDelayMs = DEFAULT_TIP_DELAY_MS, fullScreen = true }) => {
  const [showTip, setShowTip] = useState(false);

  useEffect(() => {
    if (tipDelayMs <= 0) {
      setShowTip(true);
      return undefined;
    }
    const timer = setTimeout(() => setShowTip(true), tipDelayMs);
    return () => clearTimeout(timer);
  }, [tipDelayMs]);

  const containerSx = fullScreen
    ? {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1300,
      }
    : {
        position: 'relative',
        width: '100%',
        minHeight: 240,
      };

  return (
    <Box
      role="status"
      aria-live="polite"
      sx={{
        ...containerSx,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.88)',
        backdropFilter: 'blur(3px)',
        px: 2,
      }}
    >
      <CircularProgress />
      <Typography sx={{ mt: 2, fontWeight: 500, color: '#1E3C72' }}>{message}</Typography>

      <Fade in={showTip} timeout={500} unmountOnExit>
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{
            mt: 3,
            px: 2,
            py: 1.25,
            maxWidth: 480,
            backgroundColor: 'rgba(63, 81, 181, 0.08)',
            border: '1px solid rgba(63, 81, 181, 0.2)',
            borderRadius: 2,
            boxShadow: '0 6px 20px rgba(15, 23, 42, 0.08)',
          }}
        >
          <Typography variant="body2" sx={{ color: '#1E3C72', textAlign: 'left' }}>
            Our server is taking a little longer than usual — thanks for hanging on!
          </Typography>
          <Tooltip arrow placement="top" enterTouchDelay={0} leaveTouchDelay={6000} title={tooltipContent}>
            <IconButton size="small" aria-label="Why is this loading slowly?" sx={{ color: '#1E3C72' }}>
              <InfoOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Fade>
    </Box>
  );
};

export default LoadingOverlay;
