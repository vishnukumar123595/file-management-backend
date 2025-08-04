
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role') ?? '';

  if (!token) {
    // User is not authenticated
    return <Navigate to="/" replace />;
  }

  if (allowedRoles.includes(role)) {
    // User has access
    return <Outlet />;
  }

  // User is authenticated but unauthorized
  return <Navigate to="/unauthorized" replace />;
};

export default ProtectedRoute;
