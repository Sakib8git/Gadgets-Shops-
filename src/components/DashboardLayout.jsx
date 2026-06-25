import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const userNav = [
  { to: '/dashboard',          label: 'Overview',      icon: '🏠' },
  { to: '/dashboard/orders',   label: 'My Orders',     icon: '📦' },
  { to: '/dashboard/wishlist', label: 'Wishlist',       icon: '❤️' },
  { to: '/dashboard/reviews',  label: 'My Reviews',    icon: '⭐' },
  { to: '/dashboard/profile',  label: 'Profile',       icon: '👤' },
];

const adminNav = [
  { to: '/admin',              label: 'Overview',      icon: '📊' },
  { to: '/admin/products',     label: 'Products',      icon: '🛍️' },
  { to: '/admin/orders',       label: 'Orders',        icon: '📦' },
  { to: '/admin/reviews',      label: 'Reviews',       icon: '⭐' },
  { to: '/admin/users',        label: 'Users',         icon: '👥' },
];

export default function DashboardLayout({ children, type = 'user' }) {
  const { user, logout, admin } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  const nav = type === 'admin' ? adminNav : userNav;

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const initials = user?.displayName
    ? user.displayName.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    : user?.email?.[0]?.toUpperCase() ?? '?';

  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-gray-950 transition-colors">

      {/* ── Sidebar ── */}
      <aside className="w-64 shrink-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col">

        {/* Logo */}
        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800">
          <NavLink to="/" className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400">
            MyShop
          </NavLink>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 capitalize">
            {type} dashboard
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-1" aria-label="Dashboard navigation">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/dashboard' || item.to === '/admin'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`
              }
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}

          {/* Switch between admin / user if admin */}
          {admin && (
            <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
              {type === 'admin' ? (
                <NavLink to="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <span>🔄</span> User View
                </NavLink>
              ) : (
                <NavLink to="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20">
                  <span>🔑</span> Admin Panel
                </NavLink>
              )}
            </div>
          )}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-gray-100 dark:border-gray-800 space-y-2">
          {/* Theme toggle */}
          <button onClick={toggle}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <span>{dark ? '☀️' : '🌙'}</span>
            {dark ? 'Light Mode' : 'Dark Mode'}
          </button>

          {/* User info */}
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-sm font-bold flex items-center justify-center shrink-0">
              {user?.photoURL
                ? <img src={user.photoURL} alt="" className="w-full h-full rounded-full object-cover" />
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
