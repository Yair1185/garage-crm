// client/src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { loginCustomer } from '../api/customers';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [phone, setPhone] = useState('');
  const [plate, setPlate] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginCustomer({ phone, license_plate: plate });
      setMessage('✅ Login successful');
      navigate('/dashboard');
    } catch (err) {
      setMessage(err.response?.data?.error || '❌ Login failed');
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      {message && <div className="alert alert-info">{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Phone</label>
          <input
            type="text"
            className="form-control"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label>License Plate</label>
          <input
            type="text"
            className="form-control"
            value={plate}
            onChange={(e) => setPlate(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
