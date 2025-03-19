import React, { useEffect, useState } from "react";
import axios from "axios";

const BlockedDays = () => {
  const [blockedDays, setBlockedDays] = useState([]);
  const [newDate, setNewDate] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBlockedDays();
  }, []);

  const fetchBlockedDays = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/blockedDays", { withCredentials: true });
      setBlockedDays(res.data);
      setLoading(false);
    } catch (err) {
      setError("שגיאה בשליפת נתונים");
      setLoading(false);
    }
  };

  const blockDate = async () => {
    if (!newDate) return alert("בחר תאריך לחסימה");
    try {
      setLoading(true);
      await axios.post("http://localhost:5000/blockedDays/block", { date: newDate }, { withCredentials: true });
      setSuccess("התאריך נחסם בהצלחה");
      setNewDate("");
      fetchBlockedDays();
    } catch (err) {
      setError("שגיאה בחסימת התאריך");
      setLoading(false);
    }
  };

  const unblockDate = async (date) => {
    try {
      setLoading(true);
      await axios.delete(`http://localhost:5000/blockedDays/unblock/${date}`, { withCredentials: true });
      setSuccess("החסימה בוטלה");
      fetchBlockedDays();
    } catch (err) {
      setError("שגיאה בביטול החסימה");
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2 className="mt-4">ניהול ימים חסומים</h2>

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      {loading && <div className="spinner-border text-primary"></div>}

      <div className="p-4 border rounded bg-light">
        <label className="form-label">בחר תאריך לחסימה:</label>
        <input
          type="date"
          value={newDate}
          onChange={(e) => setNewDate(e.target.value)}
          className="form-control mb-2"
        />
        <button onClick={blockDate} className="btn btn-danger">חסום תאריך</button>
      </div>

      <table className="table table-striped table-hover mt-4">
        <thead>
          <tr>
            <th>תאריך</th>
            <th>פעולות</th>
          </tr>
        </thead>
        <tbody>
          {blockedDays.map((day) => (
            <tr key={day.id}>
              <td>{day.date}</td>
              <td>
                <button onClick={() => unblockDate(day.date)} className="btn btn-success">בטל חסימה</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BlockedDays;