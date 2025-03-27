// ✅ client/src/pages/CustomerNewAppointment.jsx
import React, { useState, useEffect } from 'react';
import { createAppointment, cancelAppointment } from '../api/appointments';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

export default function CustomerNewAppointment() {
  const [vehicles, setVehicles] = useState([]);
  const [vehicleId, setVehicleId] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const editMode = location.state?.appointment;
  const appointmentToEdit = location.state?.appointment;

  useEffect(() => {
    axios.get('http://localhost:5000/customers/dashboard', { withCredentials: true })
      .then(res => {
        setVehicles(res.data.vehicles);
        if (appointmentToEdit) {
          setVehicleId(appointmentToEdit.vehicle_id);
          setAppointmentDate(appointmentToEdit.appointment_date);
          setAppointmentTime(appointmentToEdit.appointment_time);
          setServiceType(appointmentToEdit.service_type);
        }
      })
      .catch(() => setMessage('שגיאה בטעינת הרכבים'));
  }, []);

  const getAvailableHours = () => {
    const options = [];
    if (!appointmentDate || !serviceType) return options;

    const day = new Date(appointmentDate).getDay(); // 0=Sunday, 6=Saturday
    const duration = {
      'טיפול קטן': 1,
      'טיפול גדול': 2,
      'בדיקה ראשונית': 3,
      'תקלה': 3
    }[serviceType] || 1;

    if (day === 6) return []; // שבת חסום
    if (day === 5 && duration > 2) return []; // שישי - רק טיפול קטן/גדול

    const openingHour = 7;
    const openingMinute = 30;
    const closingHour = 14;

    for (let h = openingHour; h < closingHour; h++) {
      for (let m of [0, 30]) {
        const start = h + m / 60;
        const end = start + duration;
        if (end <= closingHour) {
          const formatted = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
          options.push(formatted);
        }
      }
    }

    return options;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editMode) {
        await cancelAppointment(appointmentToEdit.id);
      }

      await createAppointment({
        vehicle_id: vehicleId,
        appointment_date: appointmentDate,
        appointment_time: appointmentTime,
        service_type: serviceType
      });

      setMessage('התור נקבע בהצלחה!');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setMessage(err.response?.data?.error || 'שגיאה ביצירת תור');
    }
  };

  return (
    <div className="home-container">
      <div className="home-card shadow-lg text-end">
        <h3 className="fw-bold">
          {editMode ? 'עריכת תור' : 'תיאום תור חדש'}
        </h3>

        {message && <div className="alert alert-info mt-3">{message}</div>}

        <form onSubmit={handleSubmit} className="mt-4">
          <div className="mb-3 text-end">
            <label className="form-label">בחר רכב</label>
            <select className="form-select" value={vehicleId} onChange={(e) => setVehicleId(e.target.value)} required>
              <option value="">בחר מהרכבים שלך</option>
              {vehicles.map(v => (
                <option key={v.id} value={v.id}>{v.model} - {v.plate}</option>
              ))}
            </select>
          </div>

          <div className="mb-3 text-end">
            <label className="form-label">תאריך</label>
            <input
              type="date"
              className="form-control"
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
              required
            />
          </div>

          <div className="mb-3 text-end">
            <label className="form-label">שעה</label>
            <select
              className="form-select"
              value={appointmentTime}
              onChange={(e) => setAppointmentTime(e.target.value)}
              required
            >
              <option value="">בחר שעה</option>
              {getAvailableHours().map((hour) => (
                <option key={hour} value={hour}>{hour}</option>
              ))}
            </select>
          </div>

          <div className="mb-3 text-end">
            <label className="form-label">סוג השירות</label>
            <select className="form-select" value={serviceType} onChange={(e) => setServiceType(e.target.value)} required>
              <option value="">בחר שירות</option>
              <option value="טיפול גדול">טיפול גדול (שעתיים)</option>
              <option value="טיפול קטן">טיפול קטן (שעה)</option>
              <option value="בדיקה ראשונית">בדיקה ראשונית (3 שעות)</option>
              <option value="תקלה">תקלה (3 שעות)</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary w-100 rounded-pill">
            {editMode ? 'עדכן תור' : 'קבע תור'}
          </button>
        </form>
      </div>
    </div>
  );
}
