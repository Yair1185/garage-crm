import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';

export default function AddAdminPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/manager/add-admin', {
        username,
        password
      }, { withCredentials: true });

      setMessage('✅ מנהל נוסף בהצלחה!');
      setUsername('');
      setPassword('');
    } catch (err) {
      setMessage('❌ שגיאה בהוספת מנהל');
    }
  };

  return (
    <div className="home-container">
      <div className="home-card shadow-lg text-end">
        <h3 className="fw-bold mb-4">הוספת מנהל חדש</h3>
        {message && <div className="alert alert-info">{message}</div>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>שם משתמש</Form.Label>
            <Form.Control type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>סיסמה</Form.Label>
            <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </Form.Group>

          <Button type="submit" className="w-100 rounded-pill" variant="success">הוסף מנהל</Button>
        </Form>

        <Button variant="outline-secondary" className="w-100 mt-3" onClick={() => navigate('/admin')}>
          חזרה לדשבורד
        </Button>
      </div>
    </div>
  );
}
