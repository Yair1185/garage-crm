// client/src/pages/CustomerDashboard.jsx
import React, { useState, useEffect } from 'react';
import { fetchDashboard, logoutCustomer } from '../api/customers';
import { useNavigate } from 'react-router-dom';

const CustomerDashboard = () => {
  const [customer, setCustomer] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const res = await fetchDashboard();
        setCustomer(res.data.customer);
        setVehicles(res.data.vehicles);
        setAppointments(res.data.appointments);
      } catch (err) {
        setError(err.response?.data?.error || '❌ Failed to load dashboard');
      }
    };
    loadDashboard();
  }, []);

  const handleLogout = async () => {
    await logoutCustomer();
    navigate('/login');
  };

  return (
    <div className="container">
      <h2>Customer Dashboard</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {customer && (
        <div className="mb-4">
          <h4>Welcome, {customer.name}</h4>
          <p>Email: {customer.email}</p>
          <p>Phone: {customer.phone}</p>
        </div>
      )}
      <div className="mb-4">
        <h5>Vehicles</h5>
        <ul className="list-group">
          {vehicles.map((vehicle) => (
            <li key={vehicle.id} className="list-group-item">
              {vehicle.model} - {vehicle.plate}
            </li>
          ))}
        </ul>
      </div>
      <div className="mb-4">
        <h5>Appointments</h5>
        <ul className="list-group">
          {appointments.map((appt) => (
            <li key={appt.id} className="list-group-item">
              {appt.date} - {appt.service} ({appt.status})
            </li>
          ))}
        </ul>
      </div>
      <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default CustomerDashboard;
