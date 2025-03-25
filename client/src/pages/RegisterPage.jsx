import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [model, setModel] = useState('');
  const [plate, setPlate] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/customers/register', {
      name, phone, email, model, plate
    }, { withCredentials: true })
      .then(() => {
        setMessage('נרשמת בהצלחה!');
        setTimeout(() => navigate('/login'), 2000);
      })
      .catch(err => setMessage(err.response?.data?.error || 'שגיאה בהרשמה'));
  };

  return (
    <div className="home-container">
      <div className="home-card shadow-lg">
        <h3 className="fw-bold">הרשמה ללקוח חדש</h3>
        {message && <div className="alert alert-info mt-3">{message}</div>}
        <form onSubmit={handleSubmit} className="mt-4">

          <div className="mb-3 text-end">
            <label className="form-label">שם מלא</label>
            <input type="text" className="form-control" value={name}
              onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className="mb-3 text-end">
            <label className="form-label">מספר טלפון</label>
            <input type="text" className="form-control" value={phone}
              onChange={(e) => setPhone(e.target.value)} required />
          </div>

          <div className="mb-3 text-end">
            <label className="form-label">אימייל</label>
            <input type="email" className="form-control" value={email}
              onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="mb-3 text-end">
            <label className="form-label">דגם רכב</label>
            <input type="text" className="form-control" value={model}
              onChange={(e) => setModel(e.target.value)} required />
          </div>

          <div className="mb-3 text-end">
            <label className="form-label">מספר רכב (לוחית רישוי)</label>
            <input type="text" className="form-control" value={plate}
              onChange={(e) => setPlate(e.target.value)} required />
          </div>

          <button type="submit" className="btn btn-primary w-100 rounded-pill">הרשמה</button>
        </form>
      </div>
    </div>
  );
}
