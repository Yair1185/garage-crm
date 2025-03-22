// ✅ client/src/pages/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="text-center">
      <h1 className="mb-4">🚗 Garage CRM - דף הבית</h1>
      <p>ניהול לקוחות, רכבים ותיאום תורים למוסך</p>

      <div className="mt-5 d-flex justify-content-center gap-3">
        <Link to="/register" className="btn btn-primary">הירשם כלקוח</Link>
        <Link to="/login" className="btn btn-success">התחבר</Link>
        <Link to="/dashboard" className="btn btn-info">מעבר ללוח בקרה</Link>
      </div>
    </div>
  );
};

export default HomePage;
