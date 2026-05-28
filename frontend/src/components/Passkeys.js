import React, { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  IconButton,
  Chip,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Snackbar,
  CircularProgress,
  Skeleton,
} from '@mui/material';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import KeyIcon from '@mui/icons-material/Key';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import ComputerIcon from '@mui/icons-material/Computer';
import UsbIcon from '@mui/icons-material/Usb';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import { getPasskeys, registerNewPasskey, renamePasskey, deletePasskey, getApiErrorMessage } from '../services/passkeyService';
import { isWebAuthnSupported, isPlatformAuthenticatorAvailable, describeWebAuthnError, suggestPasskeyName } from '../utils/webauthn';

const GRADIENT = 'linear-gradient(135deg, #1E3C72 0%, #2A5298 100%)';

const formatDate = iso => {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  } catch (err) {
    return null;
  }
};

const formatDateTime = iso => {
  if (!iso) return 'Never used';
  try {
    return new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
  } catch (err) {
    return 'Never used';
  }
};

const deviceMeta = passkey => {
  const transports = (passkey.transports || '').toLowerCase();
  if (transports.includes('hybrid')) return { icon: <SmartphoneIcon />, label: 'Phone / tablet' };
  if (transports.includes('usb') || transports.includes('nfc') || transports.includes('ble')) {
    return { icon: <UsbIcon />, label: 'Security key' };
  }
  if (transports.includes('internal')) return { icon: <ComputerIcon />, label: 'This device' };
  return { icon: <KeyIcon />, label: 'Passkey' };
};

/**
 * Account → Passkeys management page: list, add, rename and remove WebAuthn passkeys for the signed
 * in user.
 */
const Passkeys = () => {
  const [passkeys, setPasskeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [supported] = useState(isWebAuthnSupported());
  const [platformAvailable, setPlatformAvailable] = useState(false);

  const [addOpen, setAddOpen] = useState(false);
  const [addName, setAddName] = useState('');
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState('');

  const [renameTarget, setRenameTarget] = useState(null);
  const [renameName, setRenameName] = useState('');
  const [renaming, setRenaming] = useState(false);
  const [renameError, setRenameError] = useState('');

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const notify = (message, severity = 'success') => setSnackbar({ open: true, message, severity });

  const fetchPasskeys = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      const data = await getPasskeys();
      setPasskeys(Array.isArray(data) ? data : []);
    } catch (err) {
      setLoadError(getApiErrorMessage(err, 'We could not load your passkeys. Please try again.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPasskeys();
    isPlatformAuthenticatorAvailable().then(setPlatformAvailable);
  }, [fetchPasskeys]);

  const openAddDialog = () => {
    setAddName(suggestPasskeyName());
    setAddError('');
    setAddOpen(true);
  };

  const handleAdd = async () => {
    setAdding(true);
    setAddError('');
    try {
      await registerNewPasskey(addName.trim());
      setAddOpen(false);
      notify('Passkey added successfully.');
      await fetchPasskeys();
    } catch (err) {
      const message =
        err && err.name && err.name.endsWith('Error') && !err.response
          ? describeWebAuthnError(err)
          : getApiErrorMessage(err, 'We could not add your passkey. Please try again.');
      setAddError(message);
    } finally {
      setAdding(false);
    }
  };

  const openRenameDialog = passkey => {
    setRenameTarget(passkey);
    setRenameName(passkey.name || '');
    setRenameError('');
  };

  const handleRename = async () => {
    if (!renameTarget) return;
    setRenaming(true);
    setRenameError('');
    try {
      await renamePasskey(renameTarget.id, renameName.trim());
      setRenameTarget(null);
      notify('Passkey renamed.');
      await fetchPasskeys();
    } catch (err) {
      setRenameError(getApiErrorMessage(err, 'We could not rename your passkey. Please try again.'));
    } finally {
      setRenaming(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deletePasskey(deleteTarget.id);
      setDeleteTarget(null);
      notify('Passkey removed.');
      await fetchPasskeys();
    } catch (err) {
      notify(getApiErrorMessage(err, 'We could not remove your passkey. Please try again.'), 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default', py: { xs: 3, md: 6 }, px: { xs: 1, md: 2 } }}>
      <Card sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: '0 20px 55px rgba(15,23,42,0.12)', mb: 3 }}>
        <Box sx={{ background: GRADIENT, color: '#fff', px: { xs: 3, md: 4 }, py: { xs: 3, md: 4 } }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(255,255,255,0.15)',
                  border: '1px solid rgba(255,255,255,0.35)',
                }}
              >
                <FingerprintIcon sx={{ fontSize: 32 }} />
              </Box>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>
                  Passkeys
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Sign in without a password using your device's biometrics or a security key.
                </Typography>
              </Box>
            </Stack>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<AddIcon />}
              onClick={openAddDialog}
              disabled={!supported}
              sx={{ whiteSpace: 'nowrap', color: '#1a1a1a', fontWeight: 700 }}
            >
              Add a passkey
            </Button>
          </Stack>
        </Box>

        <CardContent sx={{ px: { xs: 2, md: 4 }, py: 3 }}>
          {!supported && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              This browser does not support passkeys. Try a modern browser such as Chrome, Safari, or Edge.
            </Alert>
          )}
          {supported && platformAvailable && (
            <Stack direction="row" spacing={1} alignItems="center" sx={{ color: 'text.secondary', mb: 1 }}>
              <VerifiedUserIcon fontSize="small" color="primary" />
              <Typography variant="body2">A built-in authenticator (Touch ID, Windows Hello, or similar) is available on this device.</Typography>
            </Stack>
          )}
          {loadError && (
            <Alert severity="error" sx={{ mb: 2 }} action={<Button color="inherit" size="small" onClick={fetchPasskeys}>Retry</Button>}>
              {loadError}
            </Alert>
          )}

          {loading ? (
            <Stack spacing={2}>
              {[1, 2].map(i => (
                <Skeleton key={i} variant="rounded" height={84} sx={{ borderRadius: 2 }} />
              ))}
            </Stack>
          ) : passkeys.length === 0 && !loadError ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <FingerprintIcon sx={{ fontSize: 64, color: 'rgba(30,60,114,0.18)' }} />
              <Typography variant="h6" sx={{ fontWeight: 700, mt: 1 }}>
                No passkeys yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 420, mx: 'auto', mt: 0.5 }}>
                Add a passkey to sign in faster and more securely. Your password will keep working as a backup.
              </Typography>
              <Button variant="contained" startIcon={<AddIcon />} onClick={openAddDialog} disabled={!supported} sx={{ mt: 2 }}>
                Add your first passkey
              </Button>
            </Box>
          ) : (
            <Stack spacing={1.5}>
              {passkeys.map(passkey => {
                const meta = deviceMeta(passkey);
                return (
                  <Card key={passkey.id} variant="outlined" sx={{ borderRadius: 2, '&:hover': { boxShadow: '0 8px 24px rgba(15,23,42,0.08)' } }}>
                    <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Box
                          sx={{
                            width: 44,
                            height: 44,
                            borderRadius: 2,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'rgba(30,60,114,0.08)',
                            color: '#1E3C72',
                            flexShrink: 0,
                          }}
                        >
                          {meta.icon}
                        </Box>
                        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 700, wordBreak: 'break-word' }}>
                            {passkey.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                            Added {formatDate(passkey.createdAt) || 'recently'} · Last used {formatDateTime(passkey.lastUsedAt)}
                          </Typography>
                          <Stack direction="row" spacing={0.75} sx={{ mt: 0.75, flexWrap: 'wrap', gap: 0.75 }}>
                            <Chip size="small" variant="outlined" label={meta.label} />
                            {passkey.discoverable && <Chip size="small" color="primary" variant="outlined" label="Passwordless" />}
                            {passkey.backupState && (
                              <Chip size="small" color="success" variant="outlined" icon={<CloudDoneIcon />} label="Synced" />
                            )}
                          </Stack>
                        </Box>
                        <Stack direction="row" spacing={0.5} sx={{ flexShrink: 0 }}>
                          <Tooltip title="Rename">
                            <IconButton aria-label={`Rename ${passkey.name}`} onClick={() => openRenameDialog(passkey)}>
                              <EditOutlinedIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Remove">
                            <IconButton aria-label={`Remove ${passkey.name}`} color="error" onClick={() => setDeleteTarget(passkey)}>
                              <DeleteOutlineIcon />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                );
              })}
            </Stack>
          )}
        </CardContent>
      </Card>

      {/* Add passkey dialog */}
      <Dialog open={addOpen} onClose={() => !adding && setAddOpen(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Add a passkey</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Give this passkey a name so you can recognise it later, then follow your device's prompt.
          </Typography>
          <TextField
            autoFocus
            fullWidth
            label="Passkey name"
            value={addName}
            onChange={e => setAddName(e.target.value)}
            inputProps={{ maxLength: 100 }}
            disabled={adding}
          />
          {addError && (
            <Typography color="error" variant="body2" sx={{ mt: 1.5 }}>
              {addError}
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setAddOpen(false)} disabled={adding} color="inherit">
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleAdd}
            disabled={adding || !addName.trim()}
            startIcon={adding ? <CircularProgress size={18} color="inherit" /> : <FingerprintIcon />}
          >
            {adding ? 'Waiting for device…' : 'Create passkey'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Rename dialog */}
      <Dialog open={Boolean(renameTarget)} onClose={() => !renaming && setRenameTarget(null)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Rename passkey</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Passkey name"
            value={renameName}
            onChange={e => setRenameName(e.target.value)}
            inputProps={{ maxLength: 100 }}
            disabled={renaming}
            sx={{ mt: 1 }}
          />
          {renameError && (
            <Typography color="error" variant="body2" sx={{ mt: 1.5 }}>
              {renameError}
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setRenameTarget(null)} disabled={renaming} color="inherit">
            Cancel
          </Button>
          <Button variant="contained" onClick={handleRename} disabled={renaming || !renameName.trim()} startIcon={renaming ? <CircularProgress size={18} color="inherit" /> : null}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog open={Boolean(deleteTarget)} onClose={() => !deleting && setDeleteTarget(null)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Remove passkey?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            You will no longer be able to sign in with <strong>{deleteTarget?.name}</strong>. This cannot be undone, but you can add it again later.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteTarget(null)} disabled={deleting} color="inherit">
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={handleDelete} disabled={deleting} startIcon={deleting ? <CircularProgress size={18} color="inherit" /> : <DeleteOutlineIcon />}>
            Remove
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbar(s => ({ ...s, open: false }))} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Passkeys;
