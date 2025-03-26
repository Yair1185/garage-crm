import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function CustomerDetails() {
  const [customer, setCustomer] = useState({});
  const [vehicles, setVehicles] = useState([]);
  const [form, setForm] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/customers/dashboard', { withCredentials: true })
      .then(res => {
        setCustomer(res.data.customer);
        setVehicles(res.data.vehicles);
        setForm({
          phone: res.data.customer.phone,
          email: res.data.customer.email,
          vehicles: res.data.vehicles.map(v => ({ ...v }))
        });
      })
      .catch(() => navigate('/login'));
  }, []);

  const handleVehicleChange = (index, field, value) => {
    const updatedVehicles = [...form.vehicles];
    updatedVehicles[index][field] = value;
    setForm({ ...form, vehicles: updatedVehicles });
  };

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:5000/customers/update`, {
        phone: form.phone,
        email: form.email,
        vehicles: form.vehicles
      }, { withCredentials: true });
      alert("הפרטים עודכנו בהצלחה!");
      navigate('/dashboard');
    } catch (err) {
      alert("שגיאה בעדכון הפרטים");
    }
  };

  return (
    <div className="home-container">
      <div className="home-card shadow-lg text-end">
        <h3 className="mb-4">הפרטים שלי</h3>

        <div className="mb-3">
          <label className="form-label">טלפון</label>
          <input type="text" className="form-control" value={form.phone || ''} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>

        <div className="mb-3">
          <label className="form-label">מייל</label>
          <input type="email" className="form-control" value={form.email || ''} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>

        <h5 className="mt-4">הרכבים שלי:</h5>
        {form.vehicles?.map((v, index) => (
          <div key={v.id} className="border p-2 mb-3 rounded">
            <div className="mb-2">
              <label className="form-label">דגם</label>
              <input type="text" className="form-control" value={v.model} onChange={(e) => handleVehicleChange(index, 'model', e.target.value)} />
            </div>
            <div className="mb-2">
              <label className="form-label">מספר רישוי</label>
              <input type="text" className="form-control" value={v.plate} onChange={(e) => handleVehicleChange(index, 'plate', e.target.value)} />
            </div>
          </div>
        ))}

        <button onClick={handleSave} className="btn btn-primary w-100 mt-3">שמור שינויים</button>
        <button onClick={() => navigate('/dashboard')} className="btn btn-link w-100 mt-2">חזור לאיזור האישי</button>
      </div>
    </div>
  );
}
