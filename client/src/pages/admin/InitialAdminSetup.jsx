import React, { useState } from 'react';
import axios from 'axios';

export default function InitialAdminSetup() {
  const [message, setMessage] = useState('');

  const handleClick = async () => {
    try {
      const res = await axios.post('https://garage-crm-app.onrender.com/admin/register', {
        username: 'admin',
        password: 'SuperSecret123!',
      });
      setMessage('✅ נוצר משתמש אדמין!');
    } catch (err) {
      setMessage('❌ שגיאה: אולי המשתמש כבר קיים?');
    }
  };

  return (
    <div className="text-center mt-5">
      <h2>יצירת משתמש אדמין</h2>
      <button onClick={handleClick} className="btn btn-danger mt-3">
        צור משתמש
      </button>
      <div className="mt-3">{message}</div>
    </div>
  );
}
