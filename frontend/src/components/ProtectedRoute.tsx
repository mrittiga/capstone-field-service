import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  let storedUser = null;
  try {
    const raw = localStorage.getItem('user');
    if (raw && raw !== 'undefined') {
      storedUser = JSON.parse(raw);
    }
  } catch (e) {
    storedUser = null;
  }

  const activeUser = user || storedUser;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  if (!activeUser) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && activeUser.role) {
    const userRoleNormalized = String(activeUser.role).toLowerCase();
    const requiredRoleNormalized = String(requiredRole).toLowerCase();

    if (userRoleNormalized !== requiredRoleNormalized) {
      return <Navigate to="/login" replace />;
    }
  }

  return <>{children}</>;
}
