import React, { useState } from 'react';
import { registerCustomer } from '../api/customers';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    model: '',
    plate: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerCustomer(formData);
      navigate('/login');
    } catch (err) {
      setError('שגיאה בהרשמה. נסה שוב');
    }
  };

  return (
    <div className="container mt-5" dir="rtl">
      <h2 className="text-center mb-4">הרשמת לקוח חדש</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit} className="border p-4 rounded bg-light shadow">
        <div className="mb-3">
          <label className="form-label">שם מלא</label>
          <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label className="form-label">מספר טלפון</label>
          <input type="tel" className="form-control" name="phone" value={formData.phone} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label className="form-label">אימייל</label>
          <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label className="form-label">דגם רכב</label>
          <input type="text" className="form-control" name="model" value={formData.model} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          <label className="form-label">מספר רישוי</label>
          <input type="text" className="form-control" name="plate" value={formData.plate} onChange={handleChange} required />
        </div>

        <button type="submit" className="btn btn-primary w-100">הרשמה</button>
      </form>
    </div>
  );
};

export default RegisterPage;
