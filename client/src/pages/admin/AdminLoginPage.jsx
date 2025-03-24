// ✅ client/src/pages/admin/AdminLoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // בדיקת סיסמה פשוטה לדוגמה
    if (password === '1185') {
      navigate('/admin');
    } else {
      setError('סיסמה שגויה');
    }
  };

  return (
    <div className="container mt-5 text-center">
      <h2>התחברות צוות</h2>
      <form onSubmit={handleLogin}>
        <input
          type="password"
          placeholder="סיסמה"
          className="form-control my-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <div className="alert alert-danger">{error}</div>}
        <button type="submit" className="btn btn-success w-100">כניסה</button>
      </form>
    </div>
  );
};

export default AdminLoginPage;
