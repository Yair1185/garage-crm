// client/src/pages/admin/BlockedDays.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BlockedDays = () => {
  const [blockedDays, setBlockedDays] = useState([]);
  const [newDate, setNewDate] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const fetchBlockedDays = async () => {
    try {
      const res = await axios.get('https://garage-crm-app.onrender.com/blockedDays');
      setBlockedDays(res.data);
    } catch (err) {
      setError('❌ Failed to load blocked days');
    }
  };

  useEffect(() => {
    fetchBlockedDays();
  }, []);

  const handleBlockDate = async () => {
    try {
      await axios.post('https://garage-crm-app.onrender.com/blockedDays/block', { date: newDate });
      setMessage('✅ Date blocked successfully');
      setNewDate('');
      fetchBlockedDays();
    } catch (err) {
      setError('❌ Failed to block date');
    }
  };

  const handleUnblockDate = async (date) => {
    try {
      await axios.delete(`https://garage-crm-app.onrender.com/blockedDays/unblock/${date}`);
      setMessage('✅ Date unblocked');
      fetchBlockedDays();
    } catch (err) {
      setError('❌ Failed to unblock date');
    }
  };

  return (
    <div className="container">
      <h2>Manage Blocked Days</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}

      <div className="mb-3">
        <input
          type="date"
          value={newDate}
          onChange={(e) => setNewDate(e.target.value)}
          className="form-control"
        />
        <button className="btn btn-primary mt-2" onClick={handleBlockDate}>
          Block Date
        </button>
      </div>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {blockedDays.map((day) => (
            <tr key={day.id}>
              <td>{day.date}</td>
              <td>
                <button
                  className="btn btn-danger"
                  onClick={() => handleUnblockDate(day.date)}
                >
                  Unblock
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BlockedDays;
