import React from 'react';
import { Navigate } from 'react-router-dom';
import useCustomerAuth from '../hooks/useCustomerAuth';
import useAdminAuth from '../hooks/useAdminAuth';

const ProtectedRoute = ({ role = 'customer', children }) => {
  const isAuthenticated =
    role === 'admin' ? useAdminAuth() : useCustomerAuth();

  if (isAuthenticated === null) {
    return <div className="text-center mt-5">⏳ טוען הרשאות...</div>;
  }

  if (!isAuthenticated) {
    const loginPath = role === 'admin' ? '/admin-login' : '/login';
    return <Navigate to={loginPath} replace />;
  }

  return children;
};

export default ProtectedRoute;
