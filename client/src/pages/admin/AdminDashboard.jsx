// client/src/pages/admin/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Button, Table } from 'react-bootstrap';

const AdminDashboard = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await axios.get('http://localhost:5000/appointments');
      setAppointments(res.data);
    } catch (err) {
      console.error('Error fetching appointments:', err);
    }
  };

  const deleteAppointment = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/appointments/${id}`);
      fetchAppointments();
    } catch (err) {
      console.error('Error deleting appointment:', err);
    }
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <Link to="/admin/blocked-days">
        <Button variant="warning" className="mb-3">Manage Blocked Days</Button>
      </Link>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Customer</th>
            <th>Vehicle</th>
            <th>Service</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appt) => (
            <tr key={appt.id}>
              <td>{appt.customer_name}</td>
              <td>{`${appt.vehicle_model} - ${appt.plate}`}</td>
              <td>{appt.service}</td>
              <td>{appt.date}</td>
              <td>
                <Button variant="danger" onClick={() => deleteAppointment(appt.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default AdminDashboard;
