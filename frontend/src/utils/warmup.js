// Wakes the backend as early as possible after the app loads.
//
// On Render's free tier the backend spins down after ~15 minutes of inactivity, so the first
// request after a quiet period pays a multi-second cold start. By firing a single, cheap request
// at the health endpoint the moment the SPA mounts, the JVM / Spring context starts warming while
// the visitor is still reading the landing page — so by the time they log in or load data the
// instance is already up, and the cold start is hidden instead of felt.

const API_BASE = process.env.REACT_APP_API_BASE_URL || 'https://employee-management-app-gdm5.onrender.com';

let warmed = false;

/**
 * Fire-and-forget ping to the backend liveness endpoint.
 *
 * Uses `no-cors` + `keepalive` so it never blocks rendering, never throws into the UI, and needs no
 * CORS preflight — we only care that the request reaches the server and starts it, not the response.
 * Runs at most once per page load.
 */
export const warmUpBackend = () => {
  if (warmed) return;
  warmed = true;

  try {
    fetch(`${API_BASE}/api/health`, {
      method: 'GET',
      mode: 'no-cors',
      cache: 'no-store',
      keepalive: true,
    }).catch(() => {
      // Best-effort only: if the instance is still booting the request may fail, and that's fine —
      // it has already triggered the spin-up, which is the whole point.
    });
  } catch {
    // Ignore environments without fetch (e.g. SSR/tests); warm-up is a non-essential optimization.
  }
};
