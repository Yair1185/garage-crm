import React, { useEffect, useState } from 'react';
import { getMyAppointments, cancelAppointment } from '../api/appointments';

export default function CustomerAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = () => {
    getMyAppointments()
      .then(res => setAppointments(res.data))
      .catch(() => setMessage('שגיאה בטעינת התורים'));
  };

  const handleCancel = (id) => {
    cancelAppointment(id)
      .then(() => {
        setMessage('התור בוטל בהצלחה');
        fetchAppointments();
      })
      .catch(err => setMessage(err.response?.data?.error || 'שגיאה בביטול'));
  };

  return (
    <div className="container mt-4">
      <h3>התורים שלי</h3>
      {message && <div className="alert alert-info">{message}</div>}

      {appointments.length === 0 ? (
        <p>אין תורים קיימים</p>
      ) : (
        <table className="table table-striped text-center">
          <thead>
            <tr>
              <th>רכב</th>
              <th>תאריך</th>
              <th>שעה</th>
              <th>סוג שירות</th>
              <th>סטטוס</th>
              <th>פעולה</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map(app => (
              <tr key={app.id}>
                <td>{app.model} - {app.plate}</td>
                <td>{app.appointment_date}</td>
                <td>{app.appointment_time}</td>
                <td>{app.service_type}</td>
                <td>{app.status}</td>
                <td>
                  <button className="btn btn-danger btn-sm" onClick={() => handleCancel(app.id)}>
                    ביטול
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
