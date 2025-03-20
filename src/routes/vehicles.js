// ✅ src/routes/vehicles.js - PostgreSQL Version
const express = require('express');
const router = express.Router();
const pool = require('../db');

// ✅ שליפת כל הרכבים עם הלקוח
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT v.*, c.name AS customer_name, c.phone
      FROM vehicles v
      JOIN customers c ON v.customer_id = c.id
      ORDER BY v.id ASC
    `);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('❌ Error fetching vehicles:', err);
    res.status(500).json({ error: 'Failed to fetch vehicles' });
  }
});

// ✅ הוספת רכב ללקוח
router.post('/add', async (req, res) => {
  const { customer_id, model, plate } = req.body;
  if (!customer_id || !model || !plate) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    await pool.query(
      `INSERT INTO vehicles (customer_id, model, plate) VALUES ($1, $2, $3)`,
      [customer_id, model, plate]
    );
    res.status(201).json({ message: 'Vehicle added successfully' });
  } catch (err) {
    console.error('❌ Error adding vehicle:', err);
    res.status(500).json({ error: 'Failed to add vehicle' });
  }
});

module.exports = router;
