import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { cancelAppointment } from '../api/appointments';

export default function CustomerDashboard() {
  const [customer, setCustomer] = useState({});
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/customers/dashboard', { withCredentials: true })
      .then(res => {
        setCustomer(res.data.customer);
        setAppointments(res.data.appointments);
      })
      .catch(() => navigate('/login'));
  }, []);

  const handleCancel = (id) => {
    if (window.confirm('האם אתה בטוח שברצונך לבטל את התור?')) {
      cancelAppointment(id).then(() => {
        setAppointments(appointments.filter(a => a.id !== id));
      });
    }
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'בוקר טוב' : hour < 18 ? 'צהריים טובים' : 'ערב טוב';

  return (
    <div className="home-container">
      <div className="home-card shadow-lg text-end">
        <h3>{greeting}, {customer.name}</h3>

        <button className="btn btn-outline-primary w-100 mt-3" onClick={() => navigate('/my-details')}>הפרטים שלי</button>
        <button className="btn btn-outline-success w-100 mt-3" onClick={() => navigate('/new-appointment')}>קבע תור חדש</button>

        <h4 className="mt-4">התורים שלי:</h4>
        {appointments.length === 0 ? (
          <p>אין תורים עתידיים</p>
        ) : (
          appointments.map(a => (
            <div key={a.id} className="border rounded p-2 mb-2">
              <p>תאריך: {a.appointment_date} בשעה: {a.appointment_time}</p>
              <p>סוג שירות: {a.service_type}</p>
              <button className="btn btn-danger me-2" onClick={() => handleCancel(a.id)}>בטל תור</button>
              {/* בעתיד נוסיף כפתור עריכה */}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
