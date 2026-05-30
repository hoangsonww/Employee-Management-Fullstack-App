import axios from 'axios';
import { getToken } from './authService';
import { createRegistrationCredential, getAssertionCredential } from '../utils/webauthn';
import { extractApiError } from '../utils/apiError';

const API_BASE = process.env.REACT_APP_API_BASE_URL || 'https://employee-management-app-gdm5.onrender.com';
const PASSKEYS_URL = `${API_BASE}/api/passkeys`;

const authHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ---------------------------------------------------------------------------
// Low-level API calls
// ---------------------------------------------------------------------------

export const startPasskeyRegistration = async () => {
  const { data } = await axios.post(`${PASSKEYS_URL}/register/start`, {}, { headers: authHeaders() });
  return data;
};

export const finishPasskeyRegistration = async (flowId, credential, name) => {
  const { data } = await axios.post(`${PASSKEYS_URL}/register/finish`, { flowId, credential, name }, { headers: authHeaders() });
  return data;
};

export const getPasskeys = async () => {
  const { data } = await axios.get(PASSKEYS_URL, { headers: authHeaders() });
  return data;
};

export const renamePasskey = async (id, name) => {
  const { data } = await axios.patch(`${PASSKEYS_URL}/${id}`, { name }, { headers: authHeaders() });
  return data;
};

export const deletePasskey = async id => {
  await axios.delete(`${PASSKEYS_URL}/${id}`, { headers: authHeaders() });
};

export const startPasskeyAuthentication = async username => {
  const body = username ? { username } : {};
  const { data } = await axios.post(`${PASSKEYS_URL}/authenticate/start`, body);
  return data;
};

export const finishPasskeyAuthentication = async (flowId, credential) => {
  const { data } = await axios.post(`${PASSKEYS_URL}/authenticate/finish`, { flowId, credential });
  return data;
};

// ---------------------------------------------------------------------------
// High-level ceremonies (API + navigator.credentials)
// ---------------------------------------------------------------------------

/**
 * Registers a new passkey for the authenticated user end to end.
 *
 * @param {string} name the human-friendly label for the passkey
 * @returns {Promise<object>} the created passkey summary
 */
export const registerNewPasskey = async name => {
  const start = await startPasskeyRegistration();
  const credential = await createRegistrationCredential(start.options.publicKey);
  return finishPasskeyRegistration(start.flowId, credential, name);
};

/**
 * Logs in with a passkey end to end and returns the issued token and username.
 *
 * @param {string} [username] an optional username to scope the ceremony to
 * @returns {Promise<{token: string, username: string}>} the auth result
 */
export const loginWithPasskey = async username => {
  const start = await startPasskeyAuthentication(username);
  const credential = await getAssertionCredential(start.options.publicKey);
  return finishPasskeyAuthentication(start.flowId, credential);
};

/**
 * Extracts a user-facing error message from an axios/API error.
 *
 * @param {unknown} error the thrown error
 * @param {string} fallback a default message
 * @returns {string} a human-readable message
 */
export const getApiErrorMessage = (error, fallback) => extractApiError(error, fallback);
