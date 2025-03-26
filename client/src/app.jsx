// ✅ client/src/App.jsx - Finalized Routing
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import CustomerDashboard from './pages/CustomerDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import BlockedDays from './pages/admin/BlockedDays';
import 'bootstrap/dist/css/bootstrap.min.css';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import CustomerNewAppointment from './pages/CustomerNewAppointment';
import CustomerDetails from './pages/CustomerDetails';
const isAuthenticated = true;
import CustomerPastAppointments from './pages/CustomerPastAppointments';
const App = () => {
  return (
    <div className="container mt-4">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />
<Route
  path="/my-details"
  element={
    <ProtectedRoute isAuthenticated={isAuthenticated}>
      <CustomerDetails />
    </ProtectedRoute>
  }
/>
        <Route path="/admin-login" element={<AdminLoginPage />} />
        
        <Route
          path="/admin"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
  path="/my-appointments"
  element={
    <ProtectedRoute isAuthenticated={isAuthenticated}>
      <CustomerPastAppointments />
    </ProtectedRoute>
  }
/>

        <Route
          path="/admin/blocked-days"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <BlockedDays />
            </ProtectedRoute>
          }
        />
<Route
  path="/my-appointments"
  element={
    <ProtectedRoute isAuthenticated={isAuthenticated}>
      <CustomerPastAppointments />
    </ProtectedRoute>
  }
/>
<Route
  path="/profile"
  element={
    <ProtectedRoute isAuthenticated={isAuthenticated}>
      <CustomerProfile />
    </ProtectedRoute>
  }
/>
        {/* ✅ הכנסתי את זה פנימה */}
        <Route
          path="/new-appointment"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <CustomerNewAppointment />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
