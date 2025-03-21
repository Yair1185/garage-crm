// client/src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    model: '',
    license_plate: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post('http://localhost:5000/customers/register', formData, { withCredentials: true });
      console.log('✅ Registration success:', res.data);
      navigate('/dashboard');
    } catch (err) {
      console.error('❌ Registration failed:', err.response?.data);
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div>
      <h2>Customer Registration</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleRegister}>
        <Form.Group className="mb-3">
          <Form.Label>Full Name</Form.Label>
          <Form.Control type="text" name="name" placeholder="Enter name" onChange={handleChange} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Phone</Form.Label>
          <Form.Control type="text" name="phone" placeholder="Enter phone" onChange={handleChange} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" name="email" placeholder="Enter email" onChange={handleChange} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Car Model</Form.Label>
          <Form.Control type="text" name="model" placeholder="Enter car model" onChange={handleChange} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>License Plate</Form.Label>
          <Form.Control type="text" name="license_plate" placeholder="Enter license plate" onChange={handleChange} />
        </Form.Group>
        <Button variant="success" type="submit">Register</Button>
      </Form>
    </div>
  );
};

export default RegisterPage;
