import { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { products as localProducts } from '../../data/products';

export default function AdminProducts() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const categories = ['All', ...new Set(localProducts.map((p) => p.category))];

  const filtered = localProducts.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                        p.category.toLowerCase().includes(search.toLowerCase());
    const matchCat    = category === 'All' || p.category === category;
    return matchSearch && matchCat;
  });

  return (
    <DashboardLayout type="admin">
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Products</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">{localProducts.length} total products</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="search"
            placeholder="Search products…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
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
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                        <span className="font-medium text-gray-800 dark:text-gray-100">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-medium px-2.5 py-1 rounded-full">
                        {p.category}
                      </span>
                    </td>
                    <td className="px-5 py-3 font-semibold text-gray-900 dark:text-white">${p.price.toFixed(2)}</td>
                    <td className="px-5 py-3">
                      <span className="text-yellow-500">★</span>
                      <span className="ml-1 text-gray-700 dark:text-gray-300">{p.rating}</span>
                    </td>
                    <td className="px-5 py-3 text-gray-500 dark:text-gray-400">{p.reviews}</td>
                    <td className="px-5 py-3 text-right">
                      <a href={`/products/${p.id}`} target="_blank" rel="noreferrer"
                        className="text-indigo-600 dark:text-indigo-400 hover:underline text-xs font-medium">
                        View →
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-12 text-gray-400 dark:text-gray-500">
                No products match your search.
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
