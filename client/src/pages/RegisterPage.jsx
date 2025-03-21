// client/src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { registerCustomer } from '../api/customers';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    model: '',
    plate: ''
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await registerCustomer(formData);
      setMessage('✅ Registration successful');
      navigate('/login');
    } catch (err) {
      setMessage(err.response?.data?.error || '❌ Registration failed');
    }
  };

  return (
    <div className="container">
      <h2>Register</h2>
      {message && <div className="alert alert-info">{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Name</label>
          <input type="text" name="name" className="form-control" onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label>Phone</label>
          <input type="text" name="phone" className="form-control" onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label>Email</label>
          <input type="email" name="email" className="form-control" onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label>Vehicle Model</label>
          <input type="text" name="model" className="form-control" onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label>License Plate</label>
          <input type="text" name="plate" className="form-control" onChange={handleChange} required />
        </div>
        <button type="submit" className="btn btn-primary">Register</button>
      </form>
    </div>
  );
};

export default RegisterPage;
