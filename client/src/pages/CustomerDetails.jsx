import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function CustomerMyDetails() {
  const [customer, setCustomer] = useState({});
  const [vehicles, setVehicles] = useState([]);
  const [message, setMessage] = useState('');
  const handleAddVehicle = () => {
    setVehicles([...vehicles, { model: '', plate: '' }]);
  };
  useEffect(() => {
    axios.get('http://localhost:5000/customers/dashboard', { withCredentials: true })
      .then(res => {
        setCustomer(res.data.customer);
        setVehicles(res.data.vehicles);
      })
      .catch(() => setMessage('שגיאה בטעינת פרטי הלקוח'));
  }, []);

  const handleChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  const handleVehicleChange = (index, field, value) => {
    const updated = [...vehicles];
    updated[index][field] = value;
    setVehicles(updated);
  };



  const handleSave = async () => {
    try {
      await axios.put('http://localhost:5000/customers/update', { phone: customer.phone, email: customer.email }, { withCredentials: true });
  
      // שליחת רכבים חדשים
      for (let v of vehicles) {
        if (!v.id && v.model && v.plate) {
          await axios.post('http://localhost:5000/customers/add-vehicle', {
            customer_id: customer.id,
            model: v.model,
            plate: v.plate
          }, { withCredentials: true });
        }
      }
  
      setMessage('✅ הפרטים נשמרו בהצלחה');
    } catch (err) {
      setMessage('❌ שגיאה בשמירת הפרטים');
    }
  };
  
  const handleSave = async () => {
    try {
      await axios.post('http://localhost:5000/customers/update', {
        ...customer,
        vehicles
      }, { withCredentials: true });
      setMessage('הפרטים עודכנו בהצלחה!');
    } catch {
      setMessage('שגיאה בעדכון הפרטים');
    }
  };

  return (
    <div className="home-container d-flex justify-content-center align-items-center text-center">
      <div className="home-card shadow-lg p-4 text-center" style={{ maxWidth: '500px', width: '100%' }}>
        <h4 className="fw-bold mb-4">הפרטים שלי</h4>
        {message && <div className="alert alert-info">{message}</div>}
  
        <label className="form-label">שם</label>
        <input className="form-control text-center mb-3" value={customer.name || ''} disabled />
  
        <label className="form-label">טלפון</label>
        <input className="form-control text-center mb-3" name="phone" value={customer.phone || ''} onChange={handleChange} />
  
        <label className="form-label">מייל</label>
        <input className="form-control text-center mb-3" name="email" value={customer.email || ''} onChange={handleChange} />
  
        <h5 className="mt-4">הרכבים שלי</h5>
        {vehicles.map((v, i) => (
          <div key={v.id} className="border rounded p-3 mb-3 bg-light">
            <label className="form-label">דגם</label>
            <input
              className="form-control text-center mb-2"
              value={v.model}
              onChange={(e) => handleVehicleChange(i, 'model', e.target.value)}
            />
            <label className="form-label">מספר רישוי</label>
            <input
              className="form-control text-center"
              value={v.plate}
              onChange={(e) => handleVehicleChange(i, 'plate', e.target.value)}
            />
          </div>
        ))}
  <button className="btn btn-outline-primary w-100 mb-3" onClick={handleAddVehicle}>
  הוסף רכב חדש
</button>
        <button className="btn btn-primary w-100 rounded-pill mt-3">שמירת שינויים</button>
      </div>
    </div>
  );
  
}
