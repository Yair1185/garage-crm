import './HomePage.css';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="home-container">
      <div className="home-card shadow-lg">

        <h2 className="text-center fw-bold">🚗 המוסך המקומי שלך בבאר שבע</h2>
        <p className="text-center">שירות אמין ומקצועי לרכב שלך, כבר 8 שנים!</p>

        <ul className="list-unstyled">
          <li>✅ מכונאות כללית, חשמל, מיזוג</li>
          <li>✅ בדיקות תקינות וטסטים</li>
          <li>✅ אבחון ותיקוני תקלות</li>
        </ul>

        <div className="mt-3">
          <strong>📍 דרך חברון 9 באר שבע</strong><br />
          🕒 שעות פעילות: א'-ה' 07:30-16:30 | ו' 07:30-11:30
        </div>

        <div className="mt-4 d-grid gap-3">
          <Link to="/register" className="btn btn-primary rounded-pill shadow">הרשמה ללקוחות חדשים</Link>
          <Link to="/login" className="btn btn-success rounded-pill shadow">כניסה ללקוחות</Link>
        </div>

        <div className="mt-4 d-flex justify-content-between gap-2">
          <a href="https://waze.com/ul?ll=31.252973,34.791462&navigate=yes" target="_blank" rel="noopener noreferrer"
            className="btn btn-outline-info w-100 shadow">📍 ניווט ב-Waze</a>
          <a href="https://maps.google.com/?q=דרך חברון 9 באר שבע" target="_blank" rel="noopener noreferrer"
            className="btn btn-outline-danger w-100 shadow">🌍 Google Maps</a>
        </div>

        <form className="mt-4">
          <h5 className="fw-bold">צור קשר</h5>
          <input type="text" className="form-control mb-2" placeholder="שם" />
          <input type="text" className="form-control mb-2" placeholder="טלפון" />
          <button type="submit" className="btn btn-dark w-100 rounded-pill shadow">שלח</button>
        </form>

      </div>
    </div>
  );
}
