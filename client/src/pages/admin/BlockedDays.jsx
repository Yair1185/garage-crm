import React, { useEffect, useState } from "react";
import axios from "axios";

const BlockedDays = () => {
  const [blockedDays, setBlockedDays] = useState([]);
  const [newDate, setNewDate] = useState("");

  useEffect(() => {
    fetchBlockedDays();
  }, []);

  const fetchBlockedDays = async () => {
    const res = await axios.get("http://localhost:5000/blockedDays", { withCredentials: true });
    setBlockedDays(res.data);
  };

  const blockDate = async () => {
    if (!newDate) return alert("בחר תאריך לחסימה");
    await axios.post("http://localhost:5000/blockedDays/block", { date: newDate }, { withCredentials: true });
    setNewDate("");
    fetchBlockedDays();
  };

  const unblockDate = async (date) => {
    await axios.delete(`http://localhost:5000/blockedDays/unblock/${date}`, { withCredentials: true });
    fetchBlockedDays();
  };

  return (
    <div className="container">
      <h2 className="mt-4">ניהול ימים חסומים</h2>
      <div className="mb-3">
        <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} className="form-control" />
        <button onClick={blockDate} className="btn btn-danger mt-2">חסום תאריך</button>
      </div>
      <table className="table">
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
