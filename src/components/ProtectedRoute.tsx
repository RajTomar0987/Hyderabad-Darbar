import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-ink-950 flex flex-col items-center justify-center p-6">
        <div className="w-12 h-12 border-3 border-gold-500/20 border-t-gold-500 rounded-full animate-spin mb-4" />
        <p className="text-gold-300 text-sm font-medium tracking-widest uppercase animate-pulse">
          Authenticating Hyderabad Darbar...
        </p>
      </div>
    );
  }

  if (requireAdmin) {
    if (!isAuthenticated || !isAdmin) {
      return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
