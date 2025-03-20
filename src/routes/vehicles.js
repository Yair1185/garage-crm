const express = require('express');
const router = express.Router();
const pool = require('../db'); // PostgreSQL

// ✅ הצגת כל הרכבים עם פרטי הלקוח
router.get('/', (req, res) => {
  db.query(`
    SELECT vehicles.id, vehicles.model, vehicles.plate, customers.name AS customer_name
    FROM vehicles
    JOIN customers ON vehicles.customer_id = customers.id
  `, [], (err, vehicles) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch vehicles' });

    res.status(200).json({ vehicles });
  });
});

// ✅ הוספת רכב חדש
router.post('/add', (req, res) => {
  const { customer_id, model, plate } = req.body;

  if (!customer_id || !model || !plate) {
    return res.status(400).json({ error: "All fields are required" });
  }

  db.query(`INSERT INTO vehicles (customer_id, model, plate) VALUES (?, ?, ?)`,
    [customer_id, model, plate],
    (err) => {
      if (err) return res.status(500).json({ error: 'Failed to add vehicle' });

      res.status(200).json({ message: 'Vehicle added successfully' });
    });
});

module.exports = router;