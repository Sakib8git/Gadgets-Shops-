import { useState, useEffect } from 'react';
import { getProducts, getCategories } from '../api/client';
import ProductCard from '../components/ProductCard';

function Spinner() {
  return (
    <div className="flex justify-center py-20">
      <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" aria-label="Loading" />
    </div>
  );
}

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('default');
  const [priceMax, setPriceMax] = useState(300);
  const [categories, setCategories] = useState(['All']);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load categories once
  useEffect(() => {
    getCategories().then(setCategories).catch(() => {});
  }, []);

  // Reload products on filter change
  useEffect(() => {
    setLoading(true);
    getProducts({
      category: activeCategory !== 'All' ? activeCategory : undefined,
      sort: sortBy !== 'default' ? sortBy : undefined,
    })
      .then(({ products }) => {
        // Apply client-side price filter (fast, avoids extra API param)
        setProducts(products.filter((p) => p.price <= priceMax));
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [activeCategory, sortBy, priceMax]);

  return (
    <main className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8">All Products</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="lg:w-56 shrink-0">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 sticky top-20">
            <h2 className="font-semibold text-gray-700 dark:text-gray-200 mb-4">Filters</h2>

            <div className="mb-6">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Category</p>
              <ul className="space-y-1" role="list">
                {categories.map((cat) => (
                  <li key={cat}>
                    <button
                      onClick={() => setActiveCategory(cat)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                        activeCategory === cat
                          ? 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-medium'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                Max Price: <span className="text-indigo-600 dark:text-indigo-400">${priceMax}</span>
              </p>
              <input type="range" min={10} max={300} step={10} value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                className="w-full accent-indigo-600" aria-label="Maximum price filter" />
              <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 mt-1">
                <span>$10</span><span>$300</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Products */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {loading ? '…' : `${products.length} products`}
            </p>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              aria-label="Sort products"
            >
              <option value="default">Sort: Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>

          {loading ? (
            <Spinner />
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product) => <ProductCard key={product._id} product={product} />)}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-400 dark:text-gray-500">
              <p className="text-lg font-medium">No products match your filters</p>
              <button
                onClick={() => { setActiveCategory('All'); setPriceMax(300); }}
                className="mt-4 text-indigo-600 dark:text-indigo-400 text-sm underline"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
