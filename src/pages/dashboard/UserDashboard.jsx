import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import useCartStore from '../../store/cartStore';
import useReviewStore from '../../store/reviewStore';

function StatCard({ icon, label, value, color }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      </div>
    </div>
  );
}

export default function UserDashboard() {
  const { user } = useAuth();
  const items      = useCartStore((s) => s.items);
  const reviews    = useReviewStore((s) => s.reviews);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalValue = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const firstName  = user?.displayName?.split(' ')[0] || 'there';

  return (
    <DashboardLayout type="user">
      <div className="p-8 max-w-5xl">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back, {firstName} 👋</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Here's what's happening with your account.</p>
        </div>

        {/* Live stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <StatCard icon="🛒" label="Items in Cart" value={totalItems}             color="bg-indigo-50 dark:bg-indigo-900/30" />
          <StatCard icon="💰" label="Cart Value"    value={`$${totalValue.toFixed(2)}`} color="bg-green-50 dark:bg-green-900/30" />
          <StatCard icon="⭐" label="Total Reviews" value={reviews.length}         color="bg-yellow-50 dark:bg-yellow-900/30" />
        </div>

        {/* Cart preview */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-800 dark:text-gray-100">Current Cart</h2>
            <Link to="/cart" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">View Cart →</Link>
          </div>
          {items.length === 0 ? (
            <div className="text-center py-8 text-gray-400 dark:text-gray-500">
              <p className="text-3xl mb-2">🛒</p>
              <p className="text-sm">Your cart is empty</p>
              <Link to="/products" className="mt-3 inline-block text-indigo-600 dark:text-indigo-400 text-sm hover:underline">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {items.slice(0, 4).map((item) => (
                <div key={item._id || item.id} className="flex items-center gap-3">
                  <img src={item.image} alt={item.name}
                    className="w-12 h-12 rounded-lg object-cover shrink-0"
                    onError={(e) => { e.target.src = 'https://placehold.co/48x48?text=?'; }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">{item.name}</p>
                    <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 shrink-0">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
              {items.length > 4 && (
                <p className="text-xs text-gray-400 text-center pt-1">+{items.length - 4} more items</p>
              )}
            </div>
          )}
        </div>

        {/* Recent reviews */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-800 dark:text-gray-100">Recent Reviews</h2>
            <Link to="/dashboard/reviews" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">View all →</Link>
          </div>
          {reviews.length === 0 ? (
            <div className="text-center py-6 text-gray-400 dark:text-gray-500">
              <p className="text-sm">No reviews yet.</p>
              <Link to="/feedback" className="mt-2 inline-block text-indigo-600 dark:text-indigo-400 text-sm hover:underline">
                Write a review →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {reviews.slice(0, 3).map((r) => (
                <div key={r._id} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                    {r.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{r.name}</p>
                      <span className="text-yellow-400 text-xs shrink-0">{'★'.repeat(r.rating)}</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">"{r.message}"</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { to: '/products',          icon: '🛍️', label: 'Shop'      },
            { to: '/cart',              icon: '🛒', label: 'My Cart'   },
            { to: '/feedback',          icon: '✍️', label: 'Review'    },
            { to: '/dashboard/profile', icon: '👤', label: 'Profile'   },
          ].map((l) => (
            <Link key={l.to} to={l.to}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 text-center hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-sm transition-all">
              <div className="text-2xl mb-1">{l.icon}</div>
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">{l.label}</div>
            </Link>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
