import React from 'react';
import { Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';

import CustomerDashboard from './pages/CustomerDashboard';
import CustomerDetails from './pages/CustomerDetails';
import CustomerPastAppointments from './pages/CustomerPastAppointments';
import CustomerNewAppointment from './pages/CustomerNewAppointment';
import CustomerProfile from './pages/CustomerProfile';

import AdminDashboard from './pages/admin/AdminDashboard';
import BlockedDays from './pages/admin/BlockedDays';
import AddAdminPage from './pages/admin/AddAdminPage';

import ProtectedRoute from './components/ProtectedRoute';
import InitialAdminSetup from './pages/admin/InitialAdminSetup';

const App = () => {
  return (
    <div className="container mt-4">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin-login" element={<AdminLoginPage />} />

        {/* 🔐 אזור לקוחות */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute role="customer">
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-details"
          element={
            <ProtectedRoute role="customer">
              <CustomerDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-appointments"
          element={
            <ProtectedRoute role="customer">
              <CustomerPastAppointments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/new-appointment"
          element={
            <ProtectedRoute role="customer">
              <CustomerNewAppointment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute role="customer">
              <CustomerProfile />
            </ProtectedRoute>
          }
        />

        {/* 🔐 אזור מנהלים */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/blocked-days"
          element={
            <ProtectedRoute role="admin">
              <BlockedDays />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/add"
          element={
            <ProtectedRoute role="admin">
              <AddAdminPage />
            </ProtectedRoute>
          }
        />
<Route path="/setup-admin" element={<InitialAdminSetup />} />

      </Routes>
      
      

     
    </div>
  );
};

export default App;
