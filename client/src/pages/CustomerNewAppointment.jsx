import React, { useState, useEffect } from 'react';
import { createAppointment } from '../api/appointments';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function CustomerNewAppointment() {
  const [vehicles, setVehicles] = useState([]);
  const [vehicleId, setVehicleId] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/customers/dashboard', { withCredentials: true })
      .then(res => setVehicles(res.data.vehicles))
      .catch(() => setMessage('שגיאה בטעינת הרכבים'));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    createAppointment({
      vehicle_id: vehicleId,
      appointment_date: appointmentDate,
      appointment_time: appointmentTime,
      service_type: serviceType
    })
      .then(() => {
        setMessage('התור נקבע בהצלחה!');
        setTimeout(() => navigate('/dashboard'), 2000);
      })
      .catch(err => setMessage(err.response.data.error));
  };

  return (
    <div className="home-container">
      <div className="home-card shadow-lg">
        <h3 className="fw-bold">תיאום תור חדש</h3>
        {message && <div className="alert alert-info mt-3">{message}</div>}
        <form onSubmit={handleSubmit} className="mt-4">

          <div className="mb-3 text-end">
            <label className="form-label">בחר רכב</label>
            <select className="form-select" onChange={(e) => setVehicleId(e.target.value)} required>
              <option value="">בחר מהרכבים שלך</option>
              {vehicles.map(v => (
                <option key={v.id} value={v.id}>{v.model} - {v.plate}</option>
              ))}
            </select>
          </div>

          <div className="mb-3 text-end">
            <label className="form-label">תאריך</label>
            <input type="date" className="form-control" onChange={(e) => setAppointmentDate(e.target.value)} required />
          </div>

          <div className="mb-3 text-end">
            <label className="form-label">שעה</label>
            <input type="time" className="form-control" onChange={(e) => setAppointmentTime(e.target.value)} required />
          </div>

          <div className="mb-3 text-end">
            <label className="form-label">סוג השירות</label>
            <select className="form-select" onChange={(e) => setServiceType(e.target.value)} required>
              <option value="">בחר שירות</option>
              <option value="טיפול גדול">טיפול גדול (שעתיים)</option>
              <option value="טיפול קטן">טיפול קטן (שעה)</option>
              <option value="בדיקה ראשונית">בדיקה ראשונית (3 שעות)</option>
              <option value="תקלה">תקלה (3 שעות)</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary w-100 rounded-pill">קבע תור</button>
        </form>
      </div>
    </div>
  );
}
