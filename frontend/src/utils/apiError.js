/**
 * Centralised, user-facing error extraction for both axios errors and the Fetch API.
 *
 * The backend (Spring Boot) usually returns a JSON body shaped like `{ message, error, status }`
 * or a validation payload like `{ errors: { field: "msg" } }`. These helpers dig the most specific
 * human-readable message out of whatever the server sent, and fall back to status-aware copy so the
 * user always gets something more useful than "Please try again".
 */

const STATUS_FALLBACKS = {
  400: 'The request was invalid. Please double-check the details and try again.',
  401: 'Your credentials are incorrect or your session has expired. Please sign in again.',
  403: 'You do not have permission to perform this action.',
  404: 'We could not find what you were looking for.',
  408: 'The request timed out. Please try again.',
  409: 'That conflicts with something that already exists.',
  422: 'Some of the information provided was invalid. Please review the form and try again.',
  429: 'Too many attempts. Please wait a moment before trying again.',
  500: 'Our server ran into a problem. Please try again shortly.',
  502: 'The server is temporarily unavailable. Please try again shortly.',
  503: 'The service is temporarily unavailable (it may be waking up). Please try again shortly.',
  504: 'The server took too long to respond. Please try again shortly.',
};

const isHtml = value => typeof value === 'string' && /^\s*</.test(value);

/**
 * Pulls the most specific message out of a parsed JSON error body.
 *
 * @param {unknown} data the parsed response body
 * @returns {string|null} a message, or null when nothing useful is present
 */
export const messageFromData = data => {
  if (!data) return null;

  if (typeof data === 'string') {
    const trimmed = data.trim();
    return trimmed && !isHtml(trimmed) ? trimmed : null;
  }

  if (typeof data !== 'object') return null;

  // Field-level validation errors: { errors: { email: "must be valid" } } or [{ message }]
  if (data.errors) {
    if (Array.isArray(data.errors)) {
      const joined = data.errors
        .map(e => (typeof e === 'string' ? e : e?.defaultMessage || e?.message || (e?.field ? `${e.field}: ${e.message || ''}` : '')))
        .filter(Boolean)
        .join(' ');
      if (joined) return joined;
    } else if (typeof data.errors === 'object') {
      const joined = Object.entries(data.errors)
        .map(([field, msg]) => `${field}: ${Array.isArray(msg) ? msg.join(', ') : msg}`)
        .join(' · ');
      if (joined) return joined;
    }
  }

  const candidate = data.message || data.error_description || data.detail || data.error || data.title;
  if (typeof candidate === 'string' && candidate.trim() && !isHtml(candidate)) {
    return candidate.trim();
  }
  return null;
};

/**
 * Extracts a user-facing message from an axios error (or any thrown value).
 *
 * @param {unknown} error the thrown error
 * @param {string} [fallback] copy to use when nothing more specific is available
 * @returns {string} a human-readable message
 */
export const extractApiError = (error, fallback = 'Something went wrong. Please try again.') => {
  if (!error) return fallback;

  // Axios error with a server response
  if (error.response) {
    const { status, data } = error.response;
    const fromBody = messageFromData(data);
    if (fromBody) return fromBody;
    if (status && STATUS_FALLBACKS[status]) return STATUS_FALLBACKS[status];
    if (status) return `Request failed (HTTP ${status}). ${fallback}`;
  }

  // Request was made but no response (network / CORS / server asleep)
  if (error.request && !error.response) {
    return 'We could not reach the server. It may be waking up — check your connection and try again in a moment.';
  }

  if (typeof error.message === 'string' && error.message && error.message !== 'Network Error') {
    return error.message;
  }
  if (error.message === 'Network Error') {
    return 'We could not reach the server. Please check your connection and try again.';
  }

  return fallback;
};

/**
 * Extracts a user-facing message from a Fetch API `Response`. Safe to call on an unconsumed body.
 *
 * @param {Response} response the fetch response
 * @param {string} [fallback] copy to use when nothing more specific is available
 * @returns {Promise<string>} a human-readable message
 */
export const extractFetchError = async (response, fallback = 'Something went wrong. Please try again.') => {
  if (!response) return fallback;
  let data = null;
  try {
    const text = await response.text();
    if (text) {
      try {
        data = JSON.parse(text);
      } catch (err) {
        data = text;
      }
    }
  } catch (err) {
    data = null;
  }
  const fromBody = messageFromData(data);
  if (fromBody) return fromBody;
  if (STATUS_FALLBACKS[response.status]) return STATUS_FALLBACKS[response.status];
  return `Request failed (HTTP ${response.status}). ${fallback}`;
};
