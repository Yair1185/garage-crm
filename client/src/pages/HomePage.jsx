// ✅ client/src/pages/HomePage.jsx - גרסה מורחבת עם טופס וניווט
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const HomePage = () => {
  const navigate = useNavigate();
  const [contact, setContact] = useState({ name: '', phone: '', message: '' });

  const handleContactSubmit = (e) => {
    e.preventDefault();
    console.log('📧 נשלח מייל:', contact);
    alert('✅ ההודעה נשלחה בהצלחה!');
    setContact({ name: '', phone: '', message: '' });
  };

  return (
    <div className="p-3 text-center" style={{ backgroundColor: '#e6f5e6', minHeight: '100vh' }}>
      {/* לוגו */}
      <img 
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTU-17_15Lvg-L8KDgGhJgBJ89dwqVeisKQgQ&s"
        alt="לוגו המוסך"
        style={{ width: '80px', position: 'absolute', top: '10px', left: '10px' }}
      />

      {/* איזור אישי */}
      <button
        className="btn btn-info position-absolute"
        style={{ top: '10px', right: '10px' }}
        onClick={() => navigate('/login')}
      >
        איזור אישי
      </button>

      {/* כותרת */}
      <h1 className="fw-bold mt-5">🚗 המוסך המקצועי שלך בבאר שבע</h1>
      <h4>שירות אמין ומקצועי לרכב שלך, כבר 8 שנים!</h4>

      {/* תוכן המוסך */}
      <div className="bg-white p-3 mt-4 rounded shadow-sm text-end">
        <p><b>מיכאל ועקנין:</b> 8 שנות ניסיון בכל סוגי הרכב</p>
        <p>✔ מכונאות כללית, חשמל, גז</p>
        <p>✔ שירות העברת טסטים</p>
        <p>✔ אמינות ושקיפות מלאה</p>
        <p>📍 הרתך 9 באר שבע | 🕒 א'-ה' 07:30-16:30 | ו' 07:30-11:30</p>
        <p>📞 08-6283123</p>
      </div>

      {/* כפתור הרשמה */}
      <button className="btn btn-primary mt-4 w-75" onClick={() => navigate('/register')}>
        הרשמה ללקוח חדש
      </button>

      {/* כפתור צוות */}
      <button className="btn btn-success mt-3 w-75" onClick={() => navigate('/admin')}>
        כניסה לצוות
      </button>

      {/* כפתורי ניווט */}
      <div className="mt-4 d-flex flex-column gap-2">
        <a className="btn btn-outline-primary" href="https://waze.com/ul?ll=31.244729,34.802648" target="_blank" rel="noreferrer">
          🚗 נווט עם Waze
        </a>
        <a className="btn btn-outline-danger" href="https://maps.google.com/?q=רחוב הרתך 9 באר שבע" target="_blank" rel="noreferrer">
          🗺️ נווט עם Google Maps
        </a>
      </div>

      {/* טופס צור קשר */}
      <div className="bg-white p-3 mt-4 rounded shadow-sm text-end">
        <h5>📩 צור קשר</h5>
        <form onSubmit={handleContactSubmit}>
          <input
            type="text"
            className="form-control my-2"
            placeholder="שם מלא"
            value={contact.name}
            required
            onChange={(e) => setContact({ ...contact, name: e.target.value })}
          />
          <input
            type="text"
            className="form-control my-2"
            placeholder="טלפון"
            value={contact.phone}
            required
            onChange={(e) => setContact({ ...contact, phone: e.target.value })}
          />
          <textarea
            className="form-control my-2"
            placeholder="הודעה"
            value={contact.message}
            required
            onChange={(e) => setContact({ ...contact, message: e.target.value })}
          />
          <button className="btn btn-dark w-100" type="submit">שלח</button>
        </form>
      </div>
    </div>
  );
};

export default HomePage;
