import DashboardLayout from '../../components/DashboardLayout';
import { products as localProducts } from '../../data/products';
import { defaultTestimonials } from '../../data/reviews';
import { Link } from 'react-router-dom';

function StatCard({ icon, label, value, sub, color }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
      <div className="flex items-center justify-between mb-3">
        <span className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl ${color}`}>{icon}</span>
      </div>
      <p className="text-2xl font-extrabold text-gray-900 dark:text-white">{value}</p>
      <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{sub}</p>}
    </div>
  );
}

const totalRevenue = localProducts.reduce((s, p) => s + p.price, 0);
const avgRating = (
  localProducts.reduce((s, p) => s + p.rating, 0) / localProducts.length
).toFixed(1);

export default function AdminDashboard() {
  return (
    <DashboardLayout type="admin">
      <div className="p-8">

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Overview</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Your store at a glance.</p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <StatCard icon="🛍️" label="Total Products"  value={localProducts.length}  color="bg-indigo-50 dark:bg-indigo-900/30" />
          <StatCard icon="⭐" label="Reviews"         value={defaultTestimonials.length} color="bg-yellow-50 dark:bg-yellow-900/30" />
          <StatCard icon="📈" label="Avg Rating"      value={avgRating}             color="bg-green-50 dark:bg-green-900/30" />
          <StatCard icon="💰" label="Catalogue Value" value={`$${totalRevenue.toFixed(0)}`} color="bg-pink-50 dark:bg-pink-900/30" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Recent products */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-800 dark:text-gray-100">Products</h2>
              <Link to="/admin/products" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">View all →</Link>
            </div>
            <div className="space-y-3">
              {localProducts.slice(0, 5).map((p) => (
                <div key={p.id} className="flex items-center gap-3">
                  <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">{p.name}</p>
                    <p className="text-xs text-gray-400">{p.category}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">${p.price}</p>
                    <p className="text-xs text-yellow-500">★ {p.rating}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent reviews */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-800 dark:text-gray-100">Recent Reviews</h2>
              <Link to="/admin/reviews" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">View all →</Link>
            </div>
            <div className="space-y-3">
              {defaultTestimonials.slice(0, 4).map((r) => (
                <div key={r.id} className="flex items-start gap-3">
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
            </div>
          </div>
        </div>

        {/* Category breakdown */}
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
          <h2 className="font-bold text-gray-800 dark:text-gray-100 mb-4">Products by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[...new Set(localProducts.map((p) => p.category))].map((cat) => {
              const count = localProducts.filter((p) => p.category === cat).length;
              const pct = Math.round((count / localProducts.length) * 100);
              return (
                <div key={cat} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">{cat}</p>
                  <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{count}</p>
                  <div className="mt-1.5 h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
