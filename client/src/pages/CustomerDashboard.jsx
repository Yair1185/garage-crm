import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { cancelAppointment } from '../api/appointments';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

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
        setAppointments([]);
      });
    }
  };

  const handleEdit = (appointment) => {
    // נעביר את הנתונים דרך הניווט
    navigate('/new-appointment', { state: { appointment } });
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'בוקר טוב' : hour < 18 ? 'צהריים טובים' : 'ערב טוב';
  const hasAppointment = appointments.length > 0;

  return (
    <div className="home-container">
      <div className="home-card shadow-lg text-end">
        <h3>{greeting}, {customer.name}</h3>

        <div className="d-grid gap-2 mt-3">
          <Button variant="outline-primary" onClick={() => navigate('/my-details')}>הפרטים שלי</Button>
          {!hasAppointment && (
            <Button variant="outline-success" onClick={() => navigate('/new-appointment')}>
              קבע תור חדש
            </Button>
            
          
          )}
          <Button variant="outline-primary" onClick={() => navigate('/profile')}>
  הפרטים שלי
</Button>

          <Button variant="outline-secondary" onClick={() => navigate('/my-appointments')}>
            תורים קודמים
          </Button>
        </div>

        <h4 className="mt-4">התורים שלי:</h4>

        {appointments.length === 0 ? (
          <p>אין תורים פעילים כרגע</p>
        ) : (
          appointments.map((a) => (
            <Card key={a.id} className="mt-3 text-end">
              <Card.Body>
                <Card.Title>תור מתואם</Card.Title>
                <Card.Text>
                  <strong>תאריך:</strong> {a.appointment_date}<br />
                  <strong>שעה:</strong> {a.appointment_time}<br />
                  <strong>שירות:</strong> {a.service_type}
                </Card.Text>
                <div className="d-flex gap-2">
                  <Button variant="danger" onClick={() => handleCancel(a.id)}>בטל תור</Button>
                  <Button variant="success" onClick={() => handleEdit(a)}>שינוי תור</Button>
                  <Button variant="outline-secondary" onClick={() => navigate('/my-appointments')}>
  תורים קודמים
</Button>

                </div>
              </Card.Body>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
