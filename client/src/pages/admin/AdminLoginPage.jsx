import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [success, setSuccess] = useState('');
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/manager/login', {
        username,
        password,
      }, { withCredentials: true });
      
      setSuccess('התחברת בהצלחה!');
      setTimeout(() => {
        window.location.href = '/admin'; // ⬅ רענון מלא ישמור את הסשן
      }, 500);
    } catch (err) {
      setError('שם משתמש או סיסמה לא נכונים');
    }
  };

  return (
    <div className="container mt-5 text-end" style={{ maxWidth: '400px' }}>
      <h2 className="mb-4">כניסת מנהל</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label className="form-label">שם משתמש</label>
          <input
            type="text"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">סיסמה</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-dark w-100">
          התחבר
        </button>
      </form>
    </div>
  );
}
