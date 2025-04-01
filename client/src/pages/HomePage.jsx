import React from 'react';
import './HomePage.css';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="container mt-4">
  {/* כפתורים עליונים בשורה בפני עצמם */}
  <div className="d-flex justify-content-end gap-3 mb-4">
  <div className="text-center">
    <Button variant="outline-dark" className="icon-btn" onClick={() => navigate('/register')} title="הרשמה">
      <i className="bi bi-person-plus"></i>
    </Button>
    <div className="icon-label">הרשמה</div>
  </div>

  <div className="text-center">
    <Button variant="outline-dark" className="icon-btn" onClick={() => navigate('/admin-login')} title="צוות">
      <i className="bi bi-person-badge"></i>
    </Button>
    <div className="icon-label">צוות</div>
  </div>

  <div className="text-center">
    <Button variant="outline-dark" className="icon-btn" onClick={() => navigate('/login')} title="אזור אישי">
      <i className="bi bi-person-circle"></i>
    </Button>
    <div className="icon-label">אזור אישי</div>
  </div>
</div>


      {/* כרטיס מרכזי */}
      <div className="home-card mx-auto shadow-lg text-end p-4 bg-white">
        <h2 className="fw-bold mb-2">מוסך מרכת המשנה (בהרצה) </h2>
        <p className="text-muted">שירות מקצועי, אמין ומסור לרכב שלך<br />כבר מעל 8 שנים!</p>

        <ul className="list-unstyled mt-3">
          <li> תיאום תור מקוון</li>
          <li> דיאגנוסטיקה ממוחשבת</li>
          <li> טיפול תקופתי ואחריות</li>
        </ul>

        <hr />

        <p className="mb-1">
          <span className="badge bg-warning text-dark">שעות פעילות</span><br />
          א׳-ה׳ 07:30–16:30 | יום ו׳ 07:30–11:30
        </p>

        <p>📍 באר שבע | ☎️ 08-6283123</p>

        <div className="d-flex gap-2 mt-3">
          <a href="https://waze.com/ul" target="_blank" className="btn btn-success w-50">
            <i className="bi bi-signpost-2-fill me-1"></i> Waze
          </a>
          <a href="https://maps.google.com" target="_blank" className="btn btn-danger w-50">
            <i className="bi bi-geo-alt-fill me-1"></i> Google Maps
          </a>
        </div>
      </div>
    </div>
  );
}
