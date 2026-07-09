// In dev, Vite proxies /api → http://localhost:5000/api
// In production, set VITE_API_URL to your deployed backend URL.
const BASE = import.meta.env.VITE_API_URL || '/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    throw new Error(`Non-JSON response (${res.status}) — server likely offline`);
  }
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

// ── Fallback: read directly from Zustand stores ───────────────────────────
// useProductStore.getState() works outside React — no hooks needed.
import useProductStore from '../store/productStore.js';
import { defaultTestimonials as localReviews } from '../data/reviews.js';

let offlineReviews = [];

function normaliseProduct(p) {
  return { ...p, _id: p._id || String(p.id) };
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
    // Read from Zustand store — picks up any admin-added products
    const storeProducts = useProductStore.getState().products.map(normaliseProduct);
    const list = applyFilters(storeProducts, params);
    return { products: list, total: list.length, page: 1, _fallback: true };
  }
};

export const getCategories = async () => {
  try {
    return await request('/products/categories');
  } catch {
    const storeProducts = useProductStore.getState().products;
    return ['All', ...new Set(storeProducts.map((p) => p.category))];
  }
};

export const getProductById = async (id) => {
  try {
    return await request(`/products/${id}`);
  } catch {
    const storeProducts = useProductStore.getState().products;
    const found =
      storeProducts.find((p) => String(p._id) === String(id)) ??
      storeProducts.find((p) => String(p.id)  === String(id));
    if (!found) throw new Error('Product not found');
    return normaliseProduct(found);
  }
};

// ── Admin product mutations (always go to server, fallback to store) ──────────

export const createProduct = async (body) => {
  try {
    return await request('/products', { method: 'POST', body: JSON.stringify(body) });
  } catch {
    // Offline fallback — save to Zustand only
    return useProductStore.getState().addProduct(body);
  }
};

export const updateProduct = async (id, body) => {
  try {
    return await request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(body) });
  } catch {
    useProductStore.getState().updateProduct(id, body);
    return { ...body, _id: id };
  }
};

export const deleteProduct = async (id) => {
  try {
    return await request(`/products/${id}`, { method: 'DELETE' });
  } catch {
    useProductStore.getState().deleteProduct(id);
    return { message: 'Deleted locally' };
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
    const avatar = body.name.split(' ').map((w) => w[0]?.toUpperCase() ?? '').join('').slice(0, 2);
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
