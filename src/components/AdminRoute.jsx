import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminRoute({ children }) {
  const { user, loading, admin } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" aria-label="Loading" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (!admin) return <Navigate to="/dashboard" replace />;

  return children;
}
