import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import type { UserRole } from '../../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const currentUser = useAuthStore(state => state.currentUser);

  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(currentUser.role)) {
    // Redirect to appropriate dashboard based on role
    const redirectPath = `/${currentUser.role}/dashboard`;
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};
