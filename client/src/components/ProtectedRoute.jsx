import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ isAuthenticated, children, role = 'customer' }) => {
  if (!isAuthenticated) {
    return <Navigate to={role === 'admin' ? '/admin-login' : '/login'} replace />;
  }
  return children;
};

export default ProtectedRoute;
