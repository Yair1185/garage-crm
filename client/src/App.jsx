import React from 'react';
import { Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import CustomerDashboard from './pages/CustomerDashboard';
import CustomerNewAppointment from './pages/CustomerNewAppointment';
import CustomerDetails from './pages/CustomerDetails';
import CustomerPastAppointments from './pages/CustomerPastAppointments';
import CustomerProfile from './pages/CustomerProfile';

import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import BlockedDays from './pages/admin/BlockedDays';
import AddAdminPage from './pages/admin/AddAdminPage';

import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <div className="container mt-4">
      <Routes>
        {/* ציבורי */}
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin-login" element={<AdminLoginPage />} />

        {/* לקוחות */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <CustomerDashboard />
          </ProtectedRoute>
        } />
        <Route path="/my-details" element={
          <ProtectedRoute>
            <CustomerDetails />
          </ProtectedRoute>
        } />
        <Route path="/my-appointments" element={
          <ProtectedRoute>
            <CustomerPastAppointments />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <CustomerProfile />
          </ProtectedRoute>
        } />
        <Route path="/new-appointment" element={
          <ProtectedRoute>
            <CustomerNewAppointment />
          </ProtectedRoute>
        } />

        {/* מנהלים */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/blocked-days" element={
          <ProtectedRoute>
            <BlockedDays />
          </ProtectedRoute>
        } />
        <Route path="/admin/add" element={
          <ProtectedRoute>
            <AddAdminPage />
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  );
};

export default App;
