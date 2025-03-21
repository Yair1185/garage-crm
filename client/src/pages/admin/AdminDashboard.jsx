// client/src/pages/admin/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [customers, setCustomers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const res = await axios.get('http://localhost:5000/manager/dashboard');
        setStats(res.data.stats);
        setCustomers(res.data.customers);
        setVehicles(res.data.vehicles);
      } catch (err) {
        setError('❌ Failed to load admin data');
      }
    };
    fetchAdminData();
  }, []);

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="container">
      <h2>Admin Dashboard</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="mb-4">
        <h5>Statistics</h5>
        <ul className="list-group">
          <li className="list-group-item">Total Customers: {stats.totalCustomers}</li>
          <li className="list-group-item">Total Vehicles: {stats.totalVehicles}</li>
          <li className="list-group-item">Total Appointments: {stats.totalAppointments}</li>
          <li className="list-group-item">Most Common Service: {stats.mostCommonService}</li>
        </ul>
      </div>

      <div className="mb-4">
        <h5>Customers</h5>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td>{c.phone}</td>
                <td>{c.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mb-4">
        <h5>Vehicles</h5>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Model</th>
              <th>Plate</th>
              <th>Customer</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((v) => (
              <tr key={v.id}>
                <td>{v.model}</td>
                <td>{v.plate}</td>
                <td>{v.customer_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default AdminDashboard;
