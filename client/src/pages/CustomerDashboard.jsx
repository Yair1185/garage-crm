import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function CustomerDashboard() {
  const [customer, setCustomer] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/customers/dashboard', { withCredentials: true })
      .then(res => {
        setCustomer(res.data.customer);
        setVehicles(res.data.vehicles);
        setAppointments(res.data.appointments);
      })
      .catch(() => setMessage('שגיאה בטעינת הנתונים'));
  }, []);

  return (
    <div className="home-container">
      <div className="home-card shadow-lg">
        <h3 className="fw-bold text-center">אזור אישי</h3>
        {message && <div className="alert alert-danger mt-3">{message}</div>}

        {customer && (
          <div className="text-end">
            <p><strong>שם:</strong> {customer.name}</p>
            <p><strong>טלפון:</strong> {customer.phone}</p>
            <p><strong>אימייל:</strong> {customer.email}</p>
          </div>
        )}

        <h5 className="mt-4">הרכבים שלי:</h5>
        {vehicles.length > 0 ? (
          <ul className="list-group">
            {vehicles.map(v => (
              <li key={v.id} className="list-group-item d-flex justify-content-between">
                <span>{v.model}</span> <span>{v.plate}</span>
              </li>
            ))}
          </ul>
        ) : <p>לא נמצאו רכבים</p>}

        <h5 className="mt-4">התורים שלי:</h5>
        {appointments.length > 0 ? (
          <ul className="list-group">
            {appointments.map(app => (
              <li key={app.id} className="list-group-item">
                {app.appointment_date} - {app.appointment_time} - {app.service_type}
              </li>
            ))}
          </ul>
        ) : <p>אין תורים עתידיים</p>}

        <div className="mt-4 d-grid gap-3">
          <Link to="/new-appointment" className="btn btn-primary rounded-pill">קבע תור חדש</Link>
          <Link to="/my-appointments" className="btn btn-outline-secondary rounded-pill">צפה בתורים</Link>
          <Link to="/" className="btn btn-dark rounded-pill">חזור לדף הבית</Link>
        </div>
      </div>
    </div>
  );
}
