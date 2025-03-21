// client/src/pages/CustomerDashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Card, ListGroup, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const CustomerDashboard = () => {
  const [customerData, setCustomerData] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await axios.get('http://localhost:5000/customers/dashboard', { withCredentials: true });
      console.log('✅ Dashboard Data:', res.data);
      setCustomerData(res.data);
    } catch (err) {
      console.error('❌ Fetch dashboard failed:', err.response?.data);
      setError(err.response?.data?.error || 'Failed to load dashboard');
    }
  };

  const handleLogout = async () => {
    await axios.get('http://localhost:5000/customers/logout', { withCredentials: true });
    navigate('/login');
  };

  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div>
      <h2>Customer Dashboard</h2>
      {customerData && (
        <>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Customer Info</Card.Title>
              <Card.Text>Name: {customerData.customer.name}</Card.Text>
              <Card.Text>Phone: {customerData.customer.phone}</Card.Text>
              <Card.Text>Email: {customerData.customer.email}</Card.Text>
            </Card.Body>
          </Card>

          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Vehicles</Card.Title>
              <ListGroup>
                {customerData.vehicles.map((v) => (
                  <ListGroup.Item key={v.id}>{v.model} - {v.plate}</ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>

          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Appointments</Card.Title>
              <ListGroup>
                {customerData.appointments.map((a) => (
                  <ListGroup.Item key={a.id}>{a.date} - {a.service}</ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>

          <Button variant="danger" onClick={handleLogout}>Logout</Button>
        </>
      )}
    </div>
  );
};

export default CustomerDashboard;
