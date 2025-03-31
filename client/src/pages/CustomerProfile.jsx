import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function CustomerProfile() {
  const [customer, setCustomer] = useState({});
  const [vehicles, setVehicles] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('https://garage-crm-app.onrender.com/customers/dashboard', { withCredentials: true })
      .then(res => {
        setCustomer(res.data.customer);
        setVehicles(res.data.vehicles);
      })
      .catch(() => setMessage('שגיאה בטעינת הנתונים'));
  }, []);

  const handleChange = (e, index = null) => {
    const { name, value } = e.target;

    if (index !== null) {
      const updatedVehicles = [...vehicles];
      updatedVehicles[index][name] = value;
      setVehicles(updatedVehicles);
    } else {
      setCustomer({ ...customer, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put('https://garage-crm-app.onrender.com/customers/update-profile', {
      customer,
      vehicles
    }, { withCredentials: true })
      .then(() => setMessage('הפרטים עודכנו בהצלחה!'))
      .catch(() => setMessage('שגיאה בעדכון הפרטים'));
  };

  return (
    <div className="home-container">
      <div className="home-card shadow-lg">
        <h3 className="fw-bold">הפרטים שלי</h3>
        {message && <div className="alert alert-info mt-3">{message}</div>}

        <Form onSubmit={handleSubmit} className="text-end">

          <Form.Group className="mb-3">
            <Form.Label>שם</Form.Label>
            <Form.Control type="text" value={customer.name || ''} disabled />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>טלפון</Form.Label>
            <Form.Control type="text" name="phone" value={customer.phone || ''} onChange={handleChange} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>אימייל</Form.Label>
            <Form.Control type="email" name="email" value={customer.email || ''} onChange={handleChange} required />
          </Form.Group>

          <hr />

          <h5>הרכבים שלי:</h5>
          {vehicles.map((v, index) => (
            <div key={v.id} className="border rounded p-3 mb-3">
              <Form.Group className="mb-2">
                <Form.Label>דגם</Form.Label>
                <Form.Control type="text" name="model" value={v.model} onChange={(e) => handleChange(e, index)} />
              </Form.Group>

              <Form.Group>
                <Form.Label>לוחית רישוי</Form.Label>
                <Form.Control type="text" name="plate" value={v.plate} onChange={(e) => handleChange(e, index)} />
              </Form.Group>
            </div>
          ))}

          <Button variant="primary" type="submit" className="w-100 mt-3 rounded-pill">שמור שינויים</Button>
        </Form>

        <Button variant="outline-secondary" className="w-100 mt-3" onClick={() => navigate('/dashboard')}>
          חזרה לאיזור האישי
        </Button>
      </div>
    </div>
  );
}
