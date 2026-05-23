const TOKEN_KEY = 'token';
const USERNAME_KEY = 'EMSusername';
const AUTH_EVENT = 'auth-change';

const authEvents = new EventTarget();
let expiryTimer = null;

const decodeJwt = token => {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '==='.slice((base64.length + 3) % 4);
    const json = decodeURIComponent(
      atob(padded)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(json);
  } catch (err) {
    return null;
  }
};

const getExpiryMs = token => {
  const decoded = decodeJwt(token);
  if (!decoded || typeof decoded.exp !== 'number') return null;
  return decoded.exp * 1000;
};

const emitAuthChange = authenticated => {
  authEvents.dispatchEvent(new CustomEvent(AUTH_EVENT, { detail: { authenticated } }));
};

const clearExpiryTimer = () => {
  if (expiryTimer) {
    clearTimeout(expiryTimer);
    expiryTimer = null;
  }
};

const scheduleExpiry = token => {
  clearExpiryTimer();
  if (!token) return;
  const expiryMs = getExpiryMs(token);
  if (!expiryMs) return;
  const delay = expiryMs - Date.now();
  if (delay <= 0) {
    clearSession();
    return;
  }
  // setTimeout in browsers caps at ~24.8 days; JWT lifetime here is 7 days, safe.
  expiryTimer = setTimeout(() => {
    clearSession();
  }, delay);
};

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const getUsername = () => localStorage.getItem(USERNAME_KEY);

export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;
  const expiryMs = getExpiryMs(token);
  if (expiryMs !== null && expiryMs <= Date.now()) {
    clearSession();
    return false;
  }
  return true;
};

export const setSession = (token, username) => {
  if (!token) return;
  localStorage.setItem(TOKEN_KEY, token);
  if (username) localStorage.setItem(USERNAME_KEY, username);
  scheduleExpiry(token);
  emitAuthChange(true);
};

export const clearSession = () => {
  const hadToken = !!localStorage.getItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USERNAME_KEY);
  clearExpiryTimer();
  if (hadToken) emitAuthChange(false);
};

export const subscribeAuth = handler => {
  const onAuth = e => handler(e.detail.authenticated);
  authEvents.addEventListener(AUTH_EVENT, onAuth);
  return () => authEvents.removeEventListener(AUTH_EVENT, onAuth);
};

const handleStorage = e => {
  if (e.key !== TOKEN_KEY && e.key !== null) return;
  const token = getToken();
  scheduleExpiry(token);
  emitAuthChange(!!token && isAuthenticated());
};

if (typeof window !== 'undefined') {
  window.addEventListener('storage', handleStorage);
  const initialToken = getToken();
  if (initialToken) {
    const expiryMs = getExpiryMs(initialToken);
    if (expiryMs !== null && expiryMs <= Date.now()) {
      clearSession();
    } else {
      scheduleExpiry(initialToken);
    }
  }
}
