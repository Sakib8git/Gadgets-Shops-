import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Public pages
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import FeedbackPage from './pages/FeedbackPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

// User dashboard
import UserDashboard from './pages/dashboard/UserDashboard';
import UserOrders    from './pages/dashboard/UserOrders';
import UserWishlist  from './pages/dashboard/UserWishlist';
import UserReviews   from './pages/dashboard/UserReviews';
import UserProfile   from './pages/dashboard/UserProfile';

// Admin dashboard
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts  from './pages/admin/AdminProducts';
import AdminOrders    from './pages/admin/AdminOrders';
import AdminReviews   from './pages/admin/AdminReviews';
import AdminUsers     from './pages/admin/AdminUsers';

import './App.css';

// Pages that use the dashboard layout manage their own full-screen layout,
// so we only wrap the store pages with <Navbar> / <Footer>.
function StoreLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
      <Navbar />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ── Public store pages ── */}
        <Route path="/"            element={<StoreLayout><HomePage /></StoreLayout>} />
        <Route path="/products"    element={<StoreLayout><ProductsPage /></StoreLayout>} />
        <Route path="/products/:id" element={<StoreLayout><ProductDetailPage /></StoreLayout>} />
        <Route path="/cart"        element={<StoreLayout><CartPage /></StoreLayout>} />
        <Route path="/feedback"    element={<StoreLayout><FeedbackPage /></StoreLayout>} />
        <Route path="/login"       element={<StoreLayout><LoginPage /></StoreLayout>} />
        <Route path="/signup"      element={<StoreLayout><SignupPage /></StoreLayout>} />

        {/* ── User dashboard (requires login) ── */}
        <Route path="/dashboard"           element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
        <Route path="/dashboard/orders"    element={<ProtectedRoute><UserOrders /></ProtectedRoute>} />
        <Route path="/dashboard/wishlist"  element={<ProtectedRoute><UserWishlist /></ProtectedRoute>} />
        <Route path="/dashboard/reviews"   element={<ProtectedRoute><UserReviews /></ProtectedRoute>} />
        <Route path="/dashboard/profile"   element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />

        {/* ── Admin dashboard (requires admin role) ── */}
        <Route path="/admin"          element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
        <Route path="/admin/orders"   element={<AdminRoute><AdminOrders /></AdminRoute>} />
        <Route path="/admin/reviews"  element={<AdminRoute><AdminReviews /></AdminRoute>} />
        <Route path="/admin/users"    element={<AdminRoute><AdminUsers /></AdminRoute>} />

      </Routes>
    </BrowserRouter>
  );
}
