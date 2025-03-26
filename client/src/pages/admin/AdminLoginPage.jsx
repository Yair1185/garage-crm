import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        'http://localhost:5000/manager/login',
        { username, password },
        { withCredentials: true }
      );
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.error || 'שגיאה כללית בהתחברות');
    }
  };

  return (
    <div className="container mt-5 text-end">
      <h2 className="mb-4">התחברות מנהל</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label>שם משתמש</label>
          <input
            type="text"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label>סיסמה</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-success w-100">
          התחבר
        </button>
      </form>
    </div>
  );
};

export default AdminLoginPage;
