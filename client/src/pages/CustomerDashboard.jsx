import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CustomerDashboard = () => {
  const [customer, setCustomer] = useState(null);
  const [appointment, setAppointment] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('https://garage-crm-app.onrender.com/customers/dashboard', { withCredentials: true })
      .then((res) => {
        setCustomer(res.data.customer);
        const future = res.data.appointments.find(a => new Date(a.appointment_date) >= new Date());
        setAppointment(future);
      })
      .catch(() => {
        navigate('/login');
      });
  }, []);

  const handleLogout = () => {
    axios.get('https://garage-crm-app.onrender.com/customers/logout', { withCredentials: true }).then(() => {
      navigate('/');
    });
  };

  const handleEdit = () => {
    navigate('/new-appointment', { state: { appointment } });
  };

  const handleCancel = () => {
    axios.delete(`https://garage-crm-app.onrender.com/appointments/${appointment.id}`, { withCredentials: true })
      .then(() => {
        setAppointment(null);
      });
  };

  const formatDate = (iso) => new Date(iso).toLocaleDateString('he-IL');
  const formatTime = (time) => time.slice(0, 5); // HH:mm

  return (
    <div className="home-container text-center">
      <div className="home-card shadow-lg p-4">

        <h4 className="fw-bold mb-3">
          {greeting()} {customer?.name || 'לקוח'}
        </h4>

        <button className="btn btn-outline-danger mb-3 rounded-pill w-100" onClick={handleLogout}>
          התנתק
        </button>

        <div className="mb-3">
          <button
            className="btn btn-outline-primary w-100 mb-2 rounded-pill"
            onClick={() => navigate('/my-details')}
          >
            הפרטים שלי
          </button>

          <button
            className="btn btn-outline-secondary w-100 rounded-pill"
            onClick={() => navigate('/previous-appointments')}
          >
            תורים קודמים
          </button>
        </div>

        <hr />

        <h5 className="fw-bold">התורים שלי:</h5>
        {!appointment ? (
  <div className="text-center mt-3">
    <div className="alert alert-info">לא קיים תור מתואם</div>
    <button
      className="btn btn-primary mt-3 rounded-pill"
      onClick={() => navigate('/new-appointment')}
    >
      קבע תור חדש
    </button>
  </div>
) : (

          <div className="card bg-light p-3 mt-3">
            <p className="fw-bold mb-1 text-success">תור מתואם</p>
            <p className="mb-1"><strong>תאריך:</strong> {formatDate(appointment.appointment_date)}</p>
            <p className="mb-1"><strong>שעה:</strong> {formatTime(appointment.appointment_time)}</p>
            <p className="mb-3"><strong>שירות:</strong> {appointment.service_type}</p>

            <div className="d-flex gap-2 justify-content-center">
              <button className="btn btn-danger rounded-pill" onClick={handleCancel}>בטל תור</button>
              <button className="btn btn-success rounded-pill" onClick={handleEdit}>שינוי תור</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'בוקר טוב,';
  if (hour < 18) return 'צהריים טובים,';
  return 'ערב טוב,';
}

export default CustomerDashboard;
