// client/src/pages/LoginPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [phone, setPhone] = useState('');
  const [plate, setPlate] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/customers/login', {
        phone,
        license_plate: plate,
      }, { withCredentials: true });

      console.log('✅ Login successful:', res.data);
      navigate('/dashboard');
    } catch (err) {
      console.error('❌ Login failed:', err.response?.data);
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div>
      <h2>Customer Login</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleLogin}>
        <Form.Group className="mb-3">
          <Form.Label>Phone</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>License Plate</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter license plate"
            value={plate}
            onChange={(e) => setPlate(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit">Login</Button>
      </Form>
    </div>
  );
};

export default LoginPage;
