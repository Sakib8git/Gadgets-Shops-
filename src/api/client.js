// In dev, Vite proxies /api → http://localhost:5000/api
// In production, set VITE_API_URL to your deployed backend URL.
// Leave unset on Netlify — the fallback data kicks in automatically.
const BASE = import.meta.env.VITE_API_URL || '/api';

// ── Low-level fetch wrapper ──────────────────────────────────────────────────
// Returns parsed JSON or throws. Never throws outside of try/catch callers.
async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });

  // Guard: if the response isn't JSON (e.g. Netlify 404 HTML page),
  // throw before calling .json() so the catch block in each function
  // can fall back to local data cleanly.
  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    throw new Error(`Non-JSON response (${res.status}) — server likely offline`);
  }

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

// ── Local fallback data (used when MongoDB / Express server is offline) ──────
import { products as localProducts } from '../data/products.js';
import { defaultTestimonials as localReviews } from '../data/reviews.js';

// In-memory store for reviews submitted while server is offline
let offlineReviews = [];

// Normalise local products so they share the same shape as MongoDB docs
// (_id used for keys / router links throughout the UI)
function normaliseProduct(p) {
  return { ...p, _id: String(p.id) };
}

function applyFilters(list, { search, category, sort, limit } = {}) {
  let result = [...list];

  if (search) {
    const q = search.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q),
    );
  }

  if (category && category !== 'All') {
    result = result.filter((p) => p.category === category);
  }

  if (sort === 'price-asc')  result.sort((a, b) => a.price - b.price);
  if (sort === 'price-desc') result.sort((a, b) => b.price - a.price);
  if (sort === 'rating')     result.sort((a, b) => b.rating - a.rating);

  if (limit) result = result.slice(0, Number(limit));

  return result;
}

// ── Products ─────────────────────────────────────────────────────────────────

export const getProducts = async (params = {}) => {
  try {
    const qs = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== '' && v !== 'All'),
    ).toString();
    return await request(`/products${qs ? `?${qs}` : ''}`);
  } catch {
    const list = applyFilters(localProducts.map(normaliseProduct), params);
    return { products: list, total: list.length, page: 1, _fallback: true };
  }
};

export const getCategories = async () => {
  try {
    return await request('/products/categories');
  } catch {
    return ['All', ...new Set(localProducts.map((p) => p.category))];
  }
};

export const getProductById = async (id) => {
  try {
    return await request(`/products/${id}`);
  } catch {
    const found =
      localProducts.find((p) => String(p.id) === String(id)) ??
      localProducts.find((p) => String(p._id) === String(id));
    if (!found) throw new Error('Product not found');
    return normaliseProduct(found);
  }
};

// ── Reviews ──────────────────────────────────────────────────────────────────

export const getReviews = async () => {
  try {
    return await request('/reviews');
  } catch {
    const seed = localReviews.map((r) => ({ ...r, _id: String(r.id) }));
    return [...offlineReviews, ...seed];
  }
};

export const createReview = async (body) => {
  try {
    return await request('/reviews', { method: 'POST', body: JSON.stringify(body) });
  } catch {
    const avatar = body.name
      .split(' ')
      .map((w) => w[0]?.toUpperCase() ?? '')
      .join('')
      .slice(0, 2);
    const review = {
      _id: String(Date.now()),
      ...body,
      avatar,
      role: 'Verified Buyer',
      createdAt: new Date().toISOString(),
    };
    offlineReviews = [review, ...offlineReviews];
    return review;
  }
};
