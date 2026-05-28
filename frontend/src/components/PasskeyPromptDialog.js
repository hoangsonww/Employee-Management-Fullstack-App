import React, { useState } from 'react';
import { Dialog, DialogContent, DialogActions, Box, Typography, Button, Stack, CircularProgress, Fade } from '@mui/material';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import BoltIcon from '@mui/icons-material/Bolt';
import LockIcon from '@mui/icons-material/Lock';
import DevicesIcon from '@mui/icons-material/Devices';
import { registerNewPasskey, getApiErrorMessage } from '../services/passkeyService';
import { describeWebAuthnError, suggestPasskeyName } from '../utils/webauthn';

const BENEFITS = [
  { icon: <BoltIcon fontSize="small" />, text: 'Sign in instantly — no password to type or remember.' },
  { icon: <LockIcon fontSize="small" />, text: 'Phishing-resistant security backed by your device.' },
  { icon: <DevicesIcon fontSize="small" />, text: 'Use your fingerprint, face, or device PIN.' },
];

/**
 * A polished modal shown after sign-up (and reusable elsewhere) that invites the user to create a
 * passkey. Drives the full WebAuthn registration ceremony and surfaces progress, success, and
 * error states in-app (never a browser alert).
 */
const PasskeyPromptDialog = ({ open, onClose, username }) => {
  const [status, setStatus] = useState('intro'); // intro | creating | success | error
  const [errorMessage, setErrorMessage] = useState('');

  const handleCreate = async () => {
    setStatus('creating');
    setErrorMessage('');
    try {
      await registerNewPasskey(suggestPasskeyName());
      setStatus('success');
    } catch (err) {
      const message =
        err && err.name && err.name.endsWith('Error') && !err.response
          ? describeWebAuthnError(err)
          : getApiErrorMessage(err, 'We could not create your passkey. Please try again.');
      setErrorMessage(message);
      setStatus('error');
    }
  };

  const handleClose = reason => {
    if (status === 'creating') return; // don't allow dismissing mid-ceremony
    setStatus('intro');
    setErrorMessage('');
    if (onClose) onClose(reason);
  };

  return (
    <Dialog
      open={open}
      onClose={(e, reason) => handleClose(reason)}
      maxWidth="xs"
      fullWidth
      aria-labelledby="passkey-prompt-title"
      PaperProps={{ sx: { borderRadius: 4, overflow: 'hidden' } }}
    >
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1E3C72 0%, #2A5298 100%)',
          color: '#fff',
          px: 3,
          pt: 4,
          pb: 3,
          textAlign: 'center',
        }}
      >
        <Box
          sx={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            mx: 'auto',
            mb: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255,255,255,0.15)',
            border: '1px solid rgba(255,255,255,0.35)',
          }}
        >
          {status === 'success' ? (
            <CheckCircleRoundedIcon sx={{ fontSize: 44, color: '#69f0ae' }} />
          ) : (
            <FingerprintIcon sx={{ fontSize: 44 }} />
          )}
        </Box>
        <Typography id="passkey-prompt-title" variant="h5" sx={{ fontWeight: 800 }}>
          {status === 'success' ? 'Passkey created!' : 'Set up a passkey'}
        </Typography>
        <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.9 }}>
          {status === 'success'
            ? 'You can now sign in without a password.'
            : `Welcome${username ? `, ${username}` : ''}! Add a passkey for faster, safer sign-in.`}
        </Typography>
      </Box>

      <DialogContent sx={{ px: 3, py: 2.5 }}>
        {status === 'success' ? (
          <Typography variant="body2" color="text.secondary" textAlign="center">
            Manage your passkeys any time from <strong>Account → Passkeys</strong>.
          </Typography>
        ) : (
          <Stack spacing={1.5}>
            {BENEFITS.map(item => (
              <Stack key={item.text} direction="row" spacing={1.5} alignItems="center">
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(30,60,114,0.08)',
                    color: '#1E3C72',
                    flexShrink: 0,
                  }}
                >
                  {item.icon}
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {item.text}
                </Typography>
              </Stack>
            ))}
            <Fade in={status === 'error'} unmountOnExit>
              <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                {errorMessage}
              </Typography>
            </Fade>
          </Stack>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 0, flexDirection: 'column', gap: 1 }}>
        {status === 'success' ? (
          <Button fullWidth variant="contained" onClick={() => handleClose('success')} sx={{ py: 1.1 }}>
            Continue
          </Button>
        ) : (
          <>
            <Button
              fullWidth
              variant="contained"
              startIcon={status === 'creating' ? <CircularProgress size={18} color="inherit" /> : <FingerprintIcon />}
              onClick={handleCreate}
              disabled={status === 'creating'}
              sx={{ py: 1.1 }}
            >
              {status === 'creating' ? 'Waiting for your device…' : status === 'error' ? 'Try again' : 'Create a passkey'}
            </Button>
            <Button fullWidth color="inherit" onClick={() => handleClose('skip')} disabled={status === 'creating'} sx={{ color: 'text.secondary' }}>
              Maybe later
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default PasskeyPromptDialog;
