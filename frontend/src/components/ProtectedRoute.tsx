import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const storedUserRaw = localStorage.getItem('user');
  const activeUser = user || (storedUserRaw ? JSON.parse(storedUserRaw) : null);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="spinner">Loading...</div>
      </div>
    );
  }

  if (!activeUser) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && activeUser.role !== requiredRole) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

