import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CustomerDetails = () => {
  const [customer, setCustomer] = useState({});
  const [vehicles, setVehicles] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('https://garage-crm-app.onrender.com/customers/dashboard', { withCredentials: true })
      .then(res => {
        setCustomer(res.data.customer);
        setVehicles(res.data.vehicles);
      })
      .catch(() => setMessage('❌ שגיאה בטעינת הפרטים'));
  }, []);

  const handleInputChange = (field, value) => {
    setCustomer({ ...customer, [field]: value });
  };

  const handleVehicleChange = (index, field, value) => {
    const updated = [...vehicles];
    updated[index][field] = value;
    setVehicles(updated);
  };

  const handleAddVehicle = () => {
    setVehicles([...vehicles, { model: '', plate: '' }]);
  };

  const handleSave = async () => {
    try {
      // עדכון פרטי לקוח
      await axios.put('https://garage-crm-app.onrender.com/customers/update', {
        phone: customer.phone,
        email: customer.email
      }, { withCredentials: true });

      // שליחת רכבים חדשים בלבד
      for (let v of vehicles) {
        if (!v.id && v.model && v.plate) {
          await axios.post('https://garage-crm-app.onrender.com/customers/add-vehicle', {
            customer_id: customer.id,
            model: v.model,
            plate: v.plate
          }, { withCredentials: true });
        }
      }

      setMessage('✅ הפרטים נשמרו בהצלחה');
    } catch (err) {
      console.error(err);
      setMessage('❌ שגיאה בשמירת הפרטים');
    }
  };

  return (
    <div className="home-container">
      <div className="home-card shadow text-end">
        <h3 className="fw-bold mb-4 text-center">הפרטים שלי</h3>

        {message && <div className="alert alert-info text-center">{message}</div>}

        <div className="mb-3">
          <label className="form-label">שם</label>
          <input className="form-control" value={customer.name || ''} disabled />
        </div>

        <div className="mb-3">
          <label className="form-label">טלפון</label>
          <input className="form-control" value={customer.phone || ''} onChange={e => handleInputChange('phone', e.target.value)} />
        </div>

        <div className="mb-4">
          <label className="form-label">מייל</label>
          <input className="form-control" value={customer.email || ''} onChange={e => handleInputChange('email', e.target.value)} />
        </div>

        <h5 className="fw-bold mb-3">הרכבים שלי</h5>

        {vehicles.map((v, index) => (
          <div key={index} className="border rounded p-3 mb-3 bg-light">
            <div className="mb-2">
              <label className="form-label">דגם</label>
              <input className="form-control" value={v.model} onChange={e => handleVehicleChange(index, 'model', e.target.value)} />
            </div>
            <div>
              <label className="form-label">מספר רישוי</label>
              <input className="form-control" value={v.plate} onChange={e => handleVehicleChange(index, 'plate', e.target.value)} />
            </div>
          </div>
        ))}

        <button className="btn btn-outline-primary w-100 mb-3" onClick={handleAddVehicle}>
          ➕ הוסף רכב חדש
        </button>

        <button className="btn btn-success w-100 rounded-pill" onClick={handleSave}>
          💾 שמור שינויים
        </button>
      </div>
    </div>
  );
};

export default CustomerDetails;
