const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');

// ✅ רישום לקוח חדש
router.post('/register', (req, res) => {
  const { name, phone, email, model, license_plate } = req.body;

  if (!name || !phone || !email || !model || !license_plate) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  db.run(
    `INSERT INTO customers (name, phone, email) VALUES (?, ?, ?)`,
    [name, phone, email],
    function (err) {
      if (err) return res.status(500).json({ error: 'Failed to register customer' });

      const customerId = this.lastID;
      db.run(
        `INSERT INTO vehicles (customer_id, model, plate) VALUES (?, ?, ?)`,
        [customerId, model, license_plate],
        (err) => {
          if (err) return res.status(500).json({ error: 'Failed to add vehicle' });
          res.status(200).json({ message: 'Customer registered successfully' });
        }
      );
    }
  );
});

// ✅ התחברות לקוח
router.post('/login', (req, res) => {
  const { phone, license_plate } = req.body;

  db.get(
    `SELECT customers.id AS customer_id FROM customers
     JOIN vehicles ON customers.id = vehicles.customer_id
     WHERE customers.phone = ? AND vehicles.plate = ?`,
    [phone, license_plate],
    (err, user) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      if (!user) return res.status(401).json({ error: 'Invalid credentials' });

      req.session.customerId = user.customer_id;
      res.status(200).json({ message: 'Login successful' });
    }
  );
});

// ✅ Dashboard לקוח
router.get('/dashboard', (req, res) => {
  if (!req.session.customerId) return res.status(401).json({ error: 'Unauthorized' });
  const customerId = req.session.customerId;

  db.get(`SELECT * FROM customers WHERE id = ?`, [customerId], (err, customer) => {
    if (err || !customer) return res.status(500).json({ error: 'Failed to fetch customer' });

    db.all(`SELECT * FROM vehicles WHERE customer_id = ?`, [customerId], (err, vehicles) => {
      if (err) return res.status(500).json({ error: 'Failed to fetch vehicles' });

      db.all(
        `SELECT * FROM appointments WHERE vehicle_id IN (SELECT id FROM vehicles WHERE customer_id = ?)`,
        [customerId],
        (err, appointments) => {
          if (err) return res.status(500).json({ error: 'Failed to fetch appointments' });

          res.status(200).json({ customer, vehicles, appointments });
        }
      );
    });
  });
});

// ✅ הוספת רכב ללקוח
router.post('/add-vehicle', (req, res) => {
  const { customer_id, model, plate } = req.body;
  if (!customer_id || !model || !plate) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  db.run(
    `INSERT INTO vehicles (customer_id, model, plate) VALUES (?, ?, ?)`,
    [customer_id, model, plate],
    (err) => {
      if (err) return res.status(500).json({ error: 'Failed to add vehicle' });
      res.status(200).json({ message: 'Vehicle added successfully' });
    }
  );
});

// ✅ התנתקות
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.status(200).json({ message: 'Logged out successfully' });
});

module.exports = router;
