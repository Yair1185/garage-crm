// ✅ src/routes/appointments.js - Updated to PostgreSQL + JSON
const express = require('express');
const router = express.Router();
const pool = require('../db');

// ✅ יצירת תור חדש
router.post('/', async (req, res) => {
  const { customer_id, vehicle_id, service, date } = req.body;

  if (!customer_id || !vehicle_id || !service || !date) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO appointments (customer_id, vehicle_id, service, date) VALUES ($1, $2, $3, $4) RETURNING *`,
      [customer_id, vehicle_id, service, date]
    );
    res.status(201).json({ message: 'Appointment created', appointment: result.rows[0] });
  } catch (err) {
    console.error('❌ Error creating appointment:', err);
    res.status(500).json({ error: 'Failed to create appointment' });
  }
});

// ✅ שליפת כל התורים
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT a.*, c.name AS customer_name, v.model AS vehicle_model, v.plate
       FROM appointments a
       JOIN customers c ON a.customer_id = c.id
       JOIN vehicles v ON a.vehicle_id = v.id`
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('❌ Error fetching appointments:', err);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

// ✅ מחיקת תור לפי ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query(`DELETE FROM appointments WHERE id = $1`, [id]);
    res.status(200).json({ message: 'Appointment deleted' });
  } catch (err) {
    console.error('❌ Error deleting appointment:', err);
    res.status(500).json({ error: 'Failed to delete appointment' });
  }
});

module.exports = router;
