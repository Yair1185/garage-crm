import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import { getPastAppointments } from '../api/appointments';

export default function CustomerPastAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getPastAppointments()
      .then(res => {
        setAppointments(res.data.appointments || []);
        setCustomerName(res.data.name || 'לקוח');
      })
      .catch(() => setMessage('שגיאה בטעינת התורים'));
  }, []);

  return (
    <div className="home-container">
      <div className="home-card shadow-lg text-end">
        <h3 className="fw-bold mb-4">שלום {customerName} 👋</h3>
        <h4 className="fw-bold mb-4">תורים קודמים</h4>

        {message && <div className="alert alert-danger">{message}</div>}

        {appointments.length === 0 ? (
          <div className="alert alert-info text-center">
            אין לך תורים קודמים להצגה.
          </div>
        ) : (
          appointments.map((a) => (
            <Card key={a.id} className="mb-3 text-end">
              <Card.Body>
                <Card.Title>תור בתאריך {a.appointment_date}</Card.Title>
                <Card.Text>
                  <strong>שעה:</strong> {a.appointment_time}<br />
                  <strong>שירות:</strong> {a.service_type}<br />
                  <strong>רכב:</strong> {a.model} - {a.plate}<br />
                  <strong>סטטוס:</strong> {a.status}
                </Card.Text>
              </Card.Body>
            </Card>
          ))
        )}

        <Button variant="secondary" className="mt-3 w-100 rounded-pill" onClick={() => navigate('/dashboard')}>
          חזור לאיזור האישי
        </Button>
      </div>
    </div>
  );
}
