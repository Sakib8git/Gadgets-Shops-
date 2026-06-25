// In dev, Vite proxies /api → http://localhost:5000/api
// In production, set VITE_API_URL to your deployed backend URL
const BASE = import.meta.env.VITE_API_URL || '/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

// ── Products ────────────────────────────────────────────────────────────────
export const getProducts = (params = {}) => {
  const qs = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== '' && v !== 'All')
  ).toString();
  return request(`/products${qs ? `?${qs}` : ''}`);
};

export const getCategories = () => request('/products/categories');

export const getProductById = (id) => request(`/products/${id}`);

// ── Reviews ─────────────────────────────────────────────────────────────────
export const getReviews  = () => request('/reviews');

export const createReview = (body) =>
  request('/reviews', { method: 'POST', body: JSON.stringify(body) });
