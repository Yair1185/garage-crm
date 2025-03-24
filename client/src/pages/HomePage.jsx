// ✅ client/src/pages/HomePage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="position-relative bg-light p-4 text-center rounded" style={{ maxWidth: '400px', margin: 'auto', marginTop: '50px' }}>
      {/* לוגו + אזור אישי */}
      <img
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTU-17_15Lvg-L8KDgGhJgBJ89dwqVeisKQgQ&s"
        alt="לוגו"
        style={{ width: '80px', position: 'absolute', top: '20px', left: '20px' }}
      />
      <button
        className="btn btn-info position-absolute top-0 end-0 m-3"
        onClick={() => navigate('/login')}
      >
        אזור אישי
      </button>

      <h2 className="mt-5">ברוכים הבאים ל-<br />Garage CRM</h2>
      <p>ניהול לקוחות, רכבים ותיאום תורים למוסך</p>

      <button
        className="btn btn-primary w-100 mb-3"
        onClick={() => navigate('/register')}
      >
        הרשמה ללקוח חדש
      </button>

      <button
        className="btn btn-success w-100"
        onClick={() => navigate('/admin-login')}
      >
        כניסה לצוות
      </button>
    </div>
  );
};

export default HomePage;
