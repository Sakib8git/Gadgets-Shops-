import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import useSellerStore from '../store/sellerStore';

const userNav = [
  { to: '/dashboard',               label: 'Overview',        icon: '🏠' },
  { to: '/dashboard/orders',        label: 'My Orders',       icon: '📦' },
  { to: '/dashboard/wishlist',      label: 'Wishlist',        icon: '❤️' },
  { to: '/dashboard/reviews',       label: 'My Reviews',      icon: '⭐' },
  { to: '/dashboard/become-seller', label: 'Become a Seller', icon: '🏪' },
  { to: '/dashboard/profile',       label: 'Profile',         icon: '👤' },
];

const sellerNav = [
  { to: '/seller',     label: 'My Products', icon: '🛍️' },
  { to: '/dashboard',  label: 'User Account', icon: '👤' },
];

const adminNav = [
  { to: '/admin',                  label: 'Overview',        icon: '📊' },
  { to: '/admin/products',         label: 'Products',        icon: '🛍️' },
  { to: '/admin/orders',           label: 'Orders',          icon: '📦' },
  { to: '/admin/reviews',          label: 'Reviews',         icon: '⭐' },
  { to: '/admin/seller-requests',  label: 'Seller Requests', icon: '🏪' },
  { to: '/admin/users',            label: 'Users',           icon: '👥' },
];

export default function DashboardLayout({ children, type = 'user' }) {
  const { user, logout, admin, seller } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  const getReqByUid = useSellerStore((s) => s.getRequestByUid);
  const pendingReqs = useSellerStore((s) => s.requests.filter((r) => r.status === 'pending').length);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const initials = user?.displayName
    ? user.displayName.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    : user?.email?.[0]?.toUpperCase() ?? '?';

  const nav = type === 'admin' ? adminNav : type === 'seller' ? sellerNav : userNav;

  // Role badge shown under logo
  const roleLabel = type === 'admin' ? 'Admin' : type === 'seller' ? 'Seller' : 'User';

  // Request status for user nav badge
  const req = user ? getReqByUid(user.uid) : null;

  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-gray-950 transition-colors">

      {/* ── Sidebar ── */}
      <aside className="w-64 shrink-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col">

        {/* Logo */}
        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800">
          <NavLink to="/" className="flex items-center">
            <img src="/mytech.png" alt="MyTech" className="h-11 w-auto object-contain" />
          </NavLink>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{roleLabel} Dashboard</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-1" aria-label="Dashboard navigation">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/dashboard' || item.to === '/admin' || item.to === '/seller'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`
              }
            >
              <span className="text-base">{item.icon}</span>
              <span className="flex-1">{item.label}</span>
              {/* Status badge on "Become a Seller" */}
              {item.to === '/dashboard/become-seller' && req && (
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  req.status === 'pending'  ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400' :
                  req.status === 'approved' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400'   :
                                              'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400'
                }`}>
                  {req.status}
                </span>
              )}
              {/* Pending badge on admin Seller Requests */}
              {item.to === '/admin/seller-requests' && pendingReqs > 0 && (
                <span className="text-xs font-bold bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center">
                  {pendingReqs}
                </span>
              )}
            </NavLink>
          ))}

          {/* Seller dashboard link when approved */}
          {seller && type === 'user' && (
            <div className="pt-3 border-t border-gray-100 dark:border-gray-800 mt-3">
              <NavLink to="/seller"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300'
                      : 'text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20'
                  }`
                }
              >
                <span>🏪</span> Seller Dashboard
              </NavLink>
            </div>
          )}

          {/* Admin ↔ User switch */}
          {admin && (
            <div className="pt-3 border-t border-gray-100 dark:border-gray-800 mt-3">
              {type === 'admin' ? (
                <NavLink to="/dashboard"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <span>🔄</span> User View
                </NavLink>
              ) : (
                <NavLink to="/admin"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20">
                  <span>🔑</span> Admin Panel
                </NavLink>
              )}
            </div>
          )}
        </nav>

        {/* Sidebar footer */}
        <div className="px-4 py-4 border-t border-gray-100 dark:border-gray-800 space-y-2">
          <button onClick={toggle}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <span>{dark ? '☀️' : '🌙'}</span>
            {dark ? 'Light Mode' : 'Dark Mode'}
          </button>

          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-sm font-bold flex items-center justify-center shrink-0 overflow-hidden">
              {user?.photoURL
                ? <img src={user.photoURL} alt="" className="w-full h-full object-cover" />
                : initials
              }
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">
                {user?.displayName || 'My Account'}
              </p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>

          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
            <span>🚪</span> Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}
