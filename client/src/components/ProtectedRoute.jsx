import React from 'react';
import { Navigate } from 'react-router-dom';
import useAdminAuth from '../hooks/useAdminAuth';
import useCustomerAuth from '../hooks/useCustomerAuth';

const ProtectedRoute = ({ children, role = 'customer' }) => {
  const isAuthenticated =
    role === 'admin' ? useAdminAuth() : useCustomerAuth();

  if (isAuthenticated === false) {
    return <Navigate to={role === 'admin' ? '/admin-login' : '/login'} replace />;
  }

  if (isAuthenticated === null) {
    // עדיין בודק התחברות – אפשר להחזיר ספלינר או כל דבר זמני
    return <div>טוען...</div>;
  }

  return children;
};

export default ProtectedRoute;
