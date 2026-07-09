import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import useProductStore from '../../store/productStore';
import useReviewStore from '../../store/reviewStore';

function StatCard({ icon, label, value, color }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
      <span className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl ${color} mb-3`}>{icon}</span>
      <p className="text-2xl font-extrabold text-gray-900 dark:text-white">{value}</p>
      <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mt-0.5">{label}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const products = useProductStore((s) => s.products);
  const reviews  = useReviewStore((s) => s.reviews);

  const totalValue = products.reduce((s, p) => s + Number(p.price), 0);
  const avgRating  = products.length
    ? (products.reduce((s, p) => s + Number(p.rating), 0) / products.length).toFixed(1)
    : '0';

  // Category breakdown from live store
  const categories = [...new Set(products.map((p) => p.category))];

  return (
    <DashboardLayout type="admin">
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Overview</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Your store at a glance.</p>
        </div>

        {/* Live stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <StatCard icon="🛍️" label="Total Products"  value={products.length}              color="bg-indigo-50 dark:bg-indigo-900/30" />
          <StatCard icon="⭐" label="Reviews"         value={reviews.length}               color="bg-yellow-50 dark:bg-yellow-900/30" />
          <StatCard icon="📈" label="Avg Rating"      value={`${avgRating} ★`}             color="bg-green-50 dark:bg-green-900/30" />
          <StatCard icon="💰" label="Catalogue Value" value={`$${totalValue.toFixed(0)}`}  color="bg-pink-50 dark:bg-pink-900/30" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

          {/* Products (live) */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-800 dark:text-gray-100">Products</h2>
              <Link to="/admin/products" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">Manage →</Link>
            </div>
            <div className="space-y-3">
              {products.slice(0, 5).map((p) => (
                <div key={p._id} className="flex items-center gap-3">
                  <img src={p.image} alt={p.name}
                    className="w-10 h-10 rounded-lg object-cover shrink-0"
                    onError={(e) => { e.target.src = 'https://placehold.co/40x40?text=?'; }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">{p.name}</p>
                    <p className="text-xs text-gray-400">{p.category}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">${Number(p.price).toFixed(2)}</p>
                    <p className="text-xs text-yellow-500">★ {p.rating}</p>
                  </div>
                </div>
              ))}
              {products.length > 5 && (
                <p className="text-xs text-center text-gray-400">+{products.length - 5} more</p>
              )}
            </div>
          </div>

          {/* Reviews (live) */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-800 dark:text-gray-100">Recent Reviews</h2>
              <Link to="/admin/reviews" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">View all →</Link>
            </div>
            <div className="space-y-3">
              {reviews.slice(0, 4).map((r) => (
                <div key={r._id} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                    {r.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{r.name}</p>
                      <span className="text-yellow-400 text-xs shrink-0">{'★'.repeat(r.rating)}</span>
                    </div>
                    <p className="text-xs text-gray-400 truncate">"{r.message}"</p>
                  </div>
                </div>
              ))}
              {reviews.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-4">No reviews yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Category breakdown (live) */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
          <h2 className="font-bold text-gray-800 dark:text-gray-100 mb-4">Products by Category</h2>
          {categories.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">No products yet.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {categories.map((cat) => {
                const count = products.filter((p) => p.category === cat).length;
                const pct   = Math.round((count / products.length) * 100);
                return (
                  <div key={cat} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 truncate">{cat}</p>
                    <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{count}</p>
                    <div className="mt-1.5 h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
