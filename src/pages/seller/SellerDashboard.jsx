import { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../api/client';
import useSellerStore from '../../store/sellerStore';

const inp = (err) =>
  `w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400
   bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100
   placeholder-gray-400 dark:placeholder-gray-500
   ${err ? 'border-red-400 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'}`;

const EMPTY = { name: '', category: '', price: '', description: '', image: '', rating: '4.5' };
const CATS  = ['Electronics', 'Clothing', 'Footwear', 'Bags', 'Accessories', 'Sports', 'Home'];

// ── Shared form for add + edit ───────────────────────────────────────────────
function ProductForm({ initial, onSave, onCancel, saving, title }) {
  const [form,   setForm]   = useState(initial);
  const [errors, setErrors] = useState({});

  const handle = (f, v) => {
    setForm((p) => ({ ...p, [f]: v }));
    if (errors[f]) setErrors((p) => ({ ...p, [f]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())        e.name        = 'Required';
    if (!form.category.trim())    e.category    = 'Required';
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0)
                                  e.price       = 'Valid price required';
    if (!form.description.trim()) e.description = 'Required';
    if (!form.image.trim())       e.image       = 'Required';
    return e;
  };

  const submit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSave(form);
  };

  return (
    <form onSubmit={submit} noValidate
      className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4">

      <div className="sm:col-span-2 flex items-center justify-between">
        <h2 className="font-bold text-gray-900 dark:text-white">{title}</h2>
        <button type="button" onClick={onCancel}
          className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
          ✕ Cancel
        </button>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Name *</label>
        <input value={form.name} onChange={(e) => handle('name', e.target.value)}
          placeholder="Product name" className={inp(errors.name)} />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Category *</label>
        <select value={form.category} onChange={(e) => handle('category', e.target.value)}
          className={inp(errors.category)}>
          <option value="">— select —</option>
          {CATS.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Price ($) *</label>
        <input type="number" min="0" step="0.01" value={form.price}
          onChange={(e) => handle('price', e.target.value)} placeholder="0.00"
          className={inp(errors.price)} />
        {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Rating (0–5)</label>
        <input type="number" min="0" max="5" step="0.1" value={form.rating}
          onChange={(e) => handle('rating', e.target.value)} className={inp(false)} />
      </div>

      <div className="sm:col-span-2">
        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Description *</label>
        <textarea rows={3} value={form.description}
          onChange={(e) => handle('description', e.target.value)}
          placeholder="Describe your product…"
          className={`${inp(errors.description)} resize-none`} />
        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
      </div>

      <div className="sm:col-span-2">
        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Image URL *</label>
        <input value={form.image} onChange={(e) => handle('image', e.target.value)}
          placeholder="https://…" className={inp(errors.image)} />
        {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
        {form.image && (
          <div className="mt-2 h-28 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-600">
            <img src={form.image} alt="preview" className="w-full h-full object-cover"
              onError={(e) => { e.target.style.display = 'none'; }} />
          </div>
        )}
      </div>

      <div className="sm:col-span-2">
        <button type="submit" disabled={saving}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors disabled:opacity-60 flex items-center gap-2">
          {saving && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
          {saving ? 'Saving…' : title}
        </button>
      </div>
    </form>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────
export default function SellerDashboard() {
  const { user }    = useAuth();
  const getReqByUid = useSellerStore((s) => s.getRequestByUid);
  const request     = getReqByUid(user?.uid);

  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [toast,    setToast]    = useState('');

  // panel: null | 'add' | { edit: product }
  const [panel, setPanel] = useState(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const load = useCallback(() => {
    setLoading(true);
    getProducts()
      .then(({ products: all }) => {
        setProducts(all.filter((p) => p.sellerUid === user?.uid || p.addedBy === user?.uid));
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [user]);

  useEffect(() => { load(); }, [load]);

  // ── Add ──────────────────────────────────────────────────────────────────
  const handleAdd = async (form) => {
    setSaving(true);
    try {
      await createProduct({
        name:        form.name.trim(),
        category:    form.category.trim(),
        price:       Number(form.price),
        description: form.description.trim(),
        image:       form.image.trim(),
        rating:      Number(form.rating) || 0,
        reviews:     0,
        sellerUid:   user.uid,
        addedBy:     user.uid,
        sellerName:  request?.shopName || user.displayName || user.email,
      });
      setPanel(null);
      showToast('✅ Product listed!');
      load();
    } catch (err) {
      showToast(`❌ ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  // ── Edit ─────────────────────────────────────────────────────────────────
  const handleEdit = async (form) => {
    setSaving(true);
    try {
      await updateProduct(panel.edit._id, {
        name:        form.name.trim(),
        category:    form.category.trim(),
        price:       Number(form.price),
        description: form.description.trim(),
        image:       form.image.trim(),
        rating:      Number(form.rating) || 0,
        reviews:     panel.edit.reviews || 0,
      });
      setPanel(null);
      showToast('✅ Product updated!');
      load();
    } catch (err) {
      showToast(`❌ ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!confirm('Remove this product from the store?')) return;
    try {
      await deleteProduct(id);
      showToast('🗑️ Product removed.');
      load();
    } catch (err) {
      showToast(`❌ ${err.message}`);
    }
  };

  return (
    <DashboardLayout type="seller">
      {toast && (
        <div className="fixed top-5 right-5 z-50 bg-gray-900 dark:bg-gray-700 text-white text-sm font-medium px-5 py-3 rounded-xl shadow-lg">
          {toast}
        </div>
      )}

      <div className="p-8 max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {request?.shopName || 'Seller'} Dashboard
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {products.length} product{products.length !== 1 ? 's' : ''} listed
            </p>
          </div>
          {!panel && (
            <button onClick={() => setPanel('add')}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Product
            </button>
          )}
        </div>

        {/* ── Add form ── */}
        {panel === 'add' && (
          <ProductForm
            title="List Product"
            initial={EMPTY}
            onSave={handleAdd}
            onCancel={() => setPanel(null)}
            saving={saving}
          />
        )}

        {/* ── Edit form ── */}
        {panel?.edit && (
          <ProductForm
            title="Save Changes"
            initial={{
              name:        panel.edit.name,
              category:    panel.edit.category,
              price:       String(panel.edit.price),
              description: panel.edit.description,
              image:       panel.edit.image,
              rating:      String(panel.edit.rating),
            }}
            onSave={handleEdit}
            onCancel={() => setPanel(null)}
            saving={saving}
          />
        )}

        {/* ── Products table ── */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16 text-gray-400 dark:text-gray-500">
              <p className="text-3xl mb-2">📦</p>
              <p className="text-sm">You haven't listed any products yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left px-5 py-3 font-semibold text-gray-600 dark:text-gray-300">Product</th>
                    <th className="text-left px-5 py-3 font-semibold text-gray-600 dark:text-gray-300">Category</th>
                    <th className="text-left px-5 py-3 font-semibold text-gray-600 dark:text-gray-300">Price</th>
                    <th className="text-left px-5 py-3 font-semibold text-gray-600 dark:text-gray-300">Rating</th>
                    <th className="px-5 py-3 text-right font-semibold text-gray-600 dark:text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {products.map((p) => (
                    <tr key={p._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <img src={p.image} alt={p.name}
                            className="w-10 h-10 rounded-lg object-cover shrink-0"
                            onError={(e) => { e.target.src = 'https://placehold.co/40x40?text=?'; }} />
                          <span className="font-medium text-gray-800 dark:text-gray-100 truncate max-w-[140px]">
                            {p.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-medium px-2.5 py-1 rounded-full">
                          {p.category}
                        </span>
                      </td>
                      <td className="px-5 py-3 font-semibold text-gray-900 dark:text-white">
                        ${Number(p.price).toFixed(2)}
                      </td>
                      <td className="px-5 py-3 text-yellow-500">★ {p.rating}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-2">
                          {/* Edit button */}
                          <button
                            onClick={() => setPanel({ edit: p })}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                            aria-label={`Edit ${p.name}`}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          {/* Delete button */}
                          <button
                            onClick={() => handleDelete(p._id)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            aria-label={`Delete ${p.name}`}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
