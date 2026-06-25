// In dev, Vite proxies /api → http://localhost:5000/api
// In production, set VITE_API_URL to your deployed backend URL
const BASE = import.meta.env.VITE_API_URL || '/api';

// ── Low-level fetch wrapper ──────────────────────────────────────────────────
async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

// ── Local fallback data (used when MongoDB server is offline) ────────────────
import { products as localProducts } from '../data/products.js';
import { defaultTestimonials as localReviews } from '../data/reviews.js';

// In-memory store for reviews submitted while server is offline
let offlineReviews = [];

// Normalise local products so they have the same shape as MongoDB docs
// (_id, reviews count) so the rest of the UI works without changes.
function normaliseProduct(p) {
  return {
    ...p,
    _id: String(p.id),    // components use _id for keys / links
  };
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
    // ↳ Server unreachable — use local JSON
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
    // id might be a numeric string ("1") or a real MongoDB ObjectId
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
    // Merge seed reviews with any submitted offline this session
    const seed = localReviews.map((r) => ({ ...r, _id: String(r.id) }));
    return [...offlineReviews, ...seed];
  }
};

export const createReview = async (body) => {
  try {
    return await request('/reviews', { method: 'POST', body: JSON.stringify(body) });
  } catch {
    // Save to in-memory list so it shows up immediately on the home page
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
