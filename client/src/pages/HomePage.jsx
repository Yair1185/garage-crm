// ✅ client/src/pages/HomePage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="homepage">
      {/* ✅ לוגו בפינה השמאלית העליונה */}
      <div className="logo-container">
      <img
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTU-17_15Lvg-L8KDgGhJgBJ89dwqVeisKQgQ&s"
        alt="לוגו המוסך"
        className="logo"
      />
</div>
      <button className="personal-area" onClick={() => navigate('/dashboard')}>
        איזור אישי
      </button>

      <div className="content">
        <h1>ברוכים הבאים למוסך מרכבת המשנה</h1>
        <p>ניהול לקוחות, רכבים ותיאום תורים למוסך</p>

        <button className="register-btn" onClick={() => navigate('/register')}>
          הרשמה
        </button>

        <button className="admin-btn" onClick={() => navigate('/admin')}>
          כניסה לצוות
        </button>
      </div>
    </div>
  );
};

export default HomePage;
