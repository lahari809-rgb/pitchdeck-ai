// Thin wrapper around the backend API.
// Local dev: Vite proxies /api -> http://localhost:4000 (see vite.config.js), so
//            VITE_API_URL can be left unset and BASE just resolves to '/api'.
// Production (Vercel): set VITE_API_URL to your deployed backend's URL
//            (e.g. https://pitchdeck-ai-backend.onrender.com) as an env var
//            in the Vercel project settings. No proxy exists in production.
const BASE = `${import.meta.env.VITE_API_URL || ''}/api`;
const BASE = '/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

export const api = {
  login: (email, password) =>
    request('/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  upload: (readmeText, filename) =>
    request('/upload', { method: 'POST', body: JSON.stringify({ readmeText, filename }) }),

  analyze: (uploadId, theme) =>
    request('/analyze', { method: 'POST', body: JSON.stringify({ uploadId, theme }) }),

  // Attempts to generate the deck. The backend responds 402 Payment Required
  // (the x402 protocol) with payment instructions if payment hasn't been made yet.
  generate: (analysisId) =>
    fetch(`${BASE}/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ analysisId })
    }),

  payWithAlgorand: (analysisId, walletAddress) =>
    request('/x402/pay', {
      method: 'POST',
      body: JSON.stringify({ analysisId, walletAddress })
    }),

  paymentStatus: (txId) => request(`/payment/status?txId=${txId}`),

  transactions: () => request('/transactions')
};
