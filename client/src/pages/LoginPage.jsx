import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [plate, setPlate] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('https://garage-crm-app.onrender.com/customers/login', { phone, plate }, { withCredentials: true })
      .then(() => {
        setMessage('התחברת בהצלחה!');
        setTimeout(() => navigate('/dashboard'), 1500);
      })
      .catch(err => setMessage(err.response?.data?.error || 'שגיאה בהתחברות'));
  };

  return (
    <div className="home-container">
      <div className="home-card shadow-lg">
        <h3 className="fw-bold">התחברות לאזור האישי</h3>
        {message && <div className="alert alert-info mt-3">{message}</div>}
        <form onSubmit={handleSubmit} className="mt-4">

          <div className="mb-3 text-end">
            <label className="form-label">מספר טלפון</label>
            <input type="text" className="form-control" value={phone}
              onChange={(e) => setPhone(e.target.value)} required />
          </div>

          <div className="mb-3 text-end">
            <label className="form-label">מספר רכב (לוחית רישוי)</label>
            <input type="text" className="form-control" value={plate}
              onChange={(e) => setPlate(e.target.value)} required />
          </div>

          <button type="submit" className="btn btn-success w-100 rounded-pill">התחבר</button>
        </form>
      </div>
    </div>
  );
}
