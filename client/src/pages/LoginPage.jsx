import React, { useState } from 'react';
import { loginCustomer } from '../api/customers';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ phone: '', plate: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginCustomer(formData);
      if (res.status === 200) {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('פרטי ההתחברות שגויים, אנא נסה שוב');
    }
  };

  return (
    <div className="container mt-5" dir="rtl">
      <h2 className="text-center mb-4">התחברות לקוח</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit} className="border p-4 rounded bg-light shadow">
        <div className="mb-3">
          <label className="form-label">מספר טלפון</label>
          <input
            type="tel"
            className="form-control"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">מספר רישוי רכב</label>
          <input
            type="text"
            className="form-control"
            name="plate"
            value={formData.plate}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">התחבר</button>
      </form>
    </div>
  );
};

export default LoginPage;
