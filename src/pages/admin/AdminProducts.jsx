import { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import useProductStore from '../../store/productStore';

// ── Reusable input class ─────────────────────────────────────────────────────
const inp = (err) =>
  `w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400
   bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100
   placeholder-gray-400 dark:placeholder-gray-500
   ${err ? 'border-red-400 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'}`;

const EMPTY_FORM = {
  name: '', category: '', price: '', description: '',
  image: '', rating: '4.5', reviews: '0',
};

// ── Product Form (used for both Add and Edit) ────────────────────────────────
function ProductForm({ initial = EMPTY_FORM, onSave, onCancel, title }) {
  const [form,   setForm]   = useState(initial);
  const [errors, setErrors] = useState({});

  const existingCategories = ['Electronics', 'Clothing', 'Footwear', 'Bags',
                               'Accessories', 'Sports', 'Home'];

  const validate = () => {
    const e = {};
    if (!form.name.trim())        e.name        = 'Required';
    if (!form.category.trim())    e.category    = 'Required';
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0)
                                  e.price       = 'Enter a valid price';
    if (!form.description.trim()) e.description = 'Required';
    if (!form.image.trim())       e.image       = 'Required';
    return e;
  };

  const handle = (field, value) => {
    setForm((p) => ({ ...p, [field]: value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: undefined }));
  };

  const submit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSave(form);
  };

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-4">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h2>

      {/* Name */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
          Product Name *
        </label>
        <input value={form.name} onChange={(e) => handle('name', e.target.value)}
          placeholder="e.g. Wireless Headphones" className={inp(errors.name)} />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>

      {/* Category */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
          Category *
        </label>
        <div className="flex gap-2">
          <select value={existingCategories.includes(form.category) ? form.category : '__custom'}
            onChange={(e) => {
              if (e.target.value !== '__custom') handle('category', e.target.value);
              else handle('category', '');
            }}
            className={`${inp(errors.category)} flex-1`}>
            <option value="">— select —</option>
            {existingCategories.map((c) => <option key={c} value={c}>{c}</option>)}
            <option value="__custom">+ Custom…</option>
          </select>
          {(!existingCategories.includes(form.category) || form.category === '') && (
            <input value={form.category} onChange={(e) => handle('category', e.target.value)}
              placeholder="Custom category" className={`${inp(errors.category)} flex-1`} />
          )}
        </div>
        {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
      </div>

      {/* Price + Rating row */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
            Price ($) *
          </label>
          <input type="number" min="0" step="0.01" value={form.price}
            onChange={(e) => handle('price', e.target.value)}
            placeholder="0.00" className={inp(errors.price)} />
          {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
            Rating (0–5)
          </label>
          <input type="number" min="0" max="5" step="0.1" value={form.rating}
            onChange={(e) => handle('rating', e.target.value)}
            className={inp(false)} />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
          Description *
        </label>
        <textarea rows={3} value={form.description}
          onChange={(e) => handle('description', e.target.value)}
          placeholder="Short product description…"
          className={`${inp(errors.description)} resize-none`} />
        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
      </div>

      {/* Image URL */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
          Image URL *
        </label>
        <input value={form.image} onChange={(e) => handle('image', e.target.value)}
          placeholder="https://images.unsplash.com/…" className={inp(errors.image)} />
        {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}

        {/* Live preview */}
        {form.image && (
          <div className="mt-2 w-full h-32 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-600">
            <img src={form.image} alt="preview"
              className="w-full h-full object-cover"
              onError={(e) => { e.target.style.display = 'none'; }} />
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button type="submit"
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm">
          {title.includes('Edit') ? 'Save Changes' : 'Add Product'}
        </button>
        <button type="button" onClick={onCancel}
          className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold py-2.5 rounded-xl transition-colors text-sm">
          Cancel
        </button>
      </div>
    </form>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────
export default function AdminProducts() {
  const { products, addProduct, updateProduct, deleteProduct } = useProductStore();

  const [search,   setSearch]   = useState('');
  const [category, setCategory] = useState('All');
  const [panel,    setPanel]    = useState(null); // null | 'add' | { edit: product }
  const [deleteConfirm, setDeleteConfirm] = useState(null); // product _id

  const categories = ['All', ...new Set(products.map((p) => p.category))];

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                        p.category.toLowerCase().includes(search.toLowerCase());
    const matchCat    = category === 'All' || p.category === category;
    return matchSearch && matchCat;
  });

  const handleAdd = (form) => {
    addProduct(form);
    setPanel(null);
  };

  const handleEdit = (form) => {
    updateProduct(panel.edit._id, form);
    setPanel(null);
  };

  const handleDelete = (id) => {
    deleteProduct(id);
    setDeleteConfirm(null);
  };

  return (
    <DashboardLayout type="admin">
      <div className="p-8 flex gap-6">

        {/* ── Product list ── */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Products</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-0.5 text-sm">
                {products.length} total · {filtered.length} shown
              </p>
            </div>
            <button onClick={() => setPanel('add')}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Product
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <input type="search" placeholder="Search products…" value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            <select value={category} onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
              {categories.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>

          {/* Table */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left px-5 py-3 font-semibold text-gray-600 dark:text-gray-300">Product</th>
                    <th className="text-left px-5 py-3 font-semibold text-gray-600 dark:text-gray-300">Category</th>
                    <th className="text-left px-5 py-3 font-semibold text-gray-600 dark:text-gray-300">Price</th>
                    <th className="text-left px-5 py-3 font-semibold text-gray-600 dark:text-gray-300">Rating</th>
                    <th className="text-left px-5 py-3 font-semibold text-gray-600 dark:text-gray-300">Reviews</th>
                    <th className="px-5 py-3 text-right font-semibold text-gray-600 dark:text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {filtered.map((p) => (
                    <tr key={p._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <img src={p.image} alt={p.name}
                            className="w-10 h-10 rounded-lg object-cover shrink-0"
                            onError={(e) => { e.target.src = 'https://placehold.co/40x40?text=?'; }} />
                          <span className="font-medium text-gray-800 dark:text-gray-100 max-w-[160px] truncate">
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
                      <td className="px-5 py-3">
                        <span className="text-yellow-500">★</span>
                        <span className="ml-1 text-gray-700 dark:text-gray-300">{p.rating}</span>
                      </td>
                      <td className="px-5 py-3 text-gray-500 dark:text-gray-400">{p.reviews}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-2">
                          {/* Edit */}
                          <button
                            onClick={() => setPanel({ edit: p })}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                            aria-label={`Edit ${p.name}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          {/* Delete */}
                          <button
                            onClick={() => setDeleteConfirm(p._id)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            aria-label={`Delete ${p.name}`}>
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

              {filtered.length === 0 && (
                <div className="text-center py-14 text-gray-400 dark:text-gray-500">
                  <p className="text-3xl mb-2">🔍</p>
                  <p className="text-sm">No products match your search.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Slide-in side panel ── */}
        {panel && (
          <div className="w-96 shrink-0">
            <div className="sticky top-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
              {panel === 'add' ? (
                <ProductForm
                  initial={EMPTY_FORM}
                  title="Add New Product"
                  onSave={handleAdd}
                  onCancel={() => setPanel(null)}
                />
              ) : (
                <ProductForm
                  initial={{
                    name:        panel.edit.name,
                    category:    panel.edit.category,
                    price:       String(panel.edit.price),
                    description: panel.edit.description,
                    image:       panel.edit.image,
                    rating:      String(panel.edit.rating),
                    reviews:     String(panel.edit.reviews),
                  }}
                  title="Edit Product"
                  onSave={handleEdit}
                  onCancel={() => setPanel(null)}
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Delete confirmation modal ── */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
          onClick={() => setDeleteConfirm(null)}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm w-full shadow-xl"
            onClick={(e) => e.stopPropagation()}>
            <div className="text-center mb-5">
              <div className="w-14 h-14 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Delete Product?</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                This action can't be undone.
              </p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm">
                Delete
              </button>
              <button onClick={() => setDeleteConfirm(null)}
                className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold py-2.5 rounded-xl transition-colors text-sm">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
