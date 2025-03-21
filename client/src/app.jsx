// ✅ client/src/App.jsx - Finalized Routing
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import CustomerDashboard from './pages/CustomerDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import BlockedDays from './pages/admin/BlockedDays';
import 'bootstrap/dist/css/bootstrap.min.css';
import ProtectedRoute from './components/ProtectedRoute';
const isAuthenticated = true;

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
    path="/admin"
    element={
      <ProtectedRoute isAuthenticated={isAuthenticated}>
        <AdminDashboard />
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
</Routes>

const App = () => {
  return (
    <Router>
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<CustomerDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/blocked-days" element={<BlockedDays />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
