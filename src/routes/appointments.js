const express = require('express');
const router = express.Router();
const pool = require('../db');

// ✅ יצירת תור
router.post('/', async (req, res) => {
  const { vehicle_id, appointment_date, appointment_time, service_type } = req.body;
  const customerId = req.session.customerId;

  if (!customerId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    // בדיקה אם היום חסום
    const blocked = await pool.query('SELECT * FROM blocked_days WHERE appointment_date = $1', [appointment_date]);
    if (blocked.rows.length) return res.status(400).json({ error: 'לא ניתן להזמין בתאריך זה' });

    // בדיקת מגבלת תורים יומית
    const count = await pool.query('SELECT COUNT(*) FROM appointments WHERE appointment_date = $1', [appointment_date]);
    if (parseInt(count.rows[0].count) >= 8) return res.status(400).json({ error: 'אין מקום פנוי בתאריך זה' });

    // בדיקה אם ללקוח יש תור פעיל
    const existing = await pool.query(
      'SELECT * FROM appointments WHERE customer_id = $1 AND appointment_date >= CURRENT_DATE',
      [customerId]
    );
    if (existing.rows.length) return res.status(400).json({ error: 'יש לך כבר תור פעיל' });

    // יצירת תור חדש
    await pool.query(`
      INSERT INTO appointments (customer_id, vehicle_id, appointment_date, appointment_time, service_type, status)
      VALUES ($1, $2, $3, $4, $5, 'מאושר')
    `, [customerId, vehicle_id, appointment_date, appointment_time, service_type]);
    

    res.status(201).json({ message: 'התור נקבע בהצלחה.' });
  } catch (err) {
    console.error('❌ Error creating appointment:', err);
    res.status(500).json({ error: 'Failed to create appointment' });
  }
});

// ✅ שליפת כל התורים - (מנהל בלבד בעתיד)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM appointments ORDER BY appointment_date');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('❌ Error fetching appointments:', err);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

// ✅ שליפת תורים של הלקוח
router.get('/my', async (req, res) => {
  const customerId = req.session.customerId;
  if (!customerId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const result = await pool.query(`
      SELECT a.*, v.model, v.plate
      FROM appointments a
      JOIN vehicles v ON a.vehicle_id = v.id
      WHERE a.customer_id = $1
      ORDER BY a.appointment_date
    `, [customerId]);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('❌ Error fetching my appointments:', err);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

// ✅ ביטול תור
router.delete('/:id', async (req, res) => {
  const customerId = req.session.customerId;
  const appointmentId = req.params.id;

  if (!customerId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    // בדוק אם התור שייך ללקוח
    const check = await pool.query('SELECT * FROM appointments WHERE id = $1 AND customer_id = $2', [appointmentId, customerId]);
    if (check.rows.length === 0) return res.status(403).json({ error: 'אין לך הרשאה לבטל תור זה' });

    // בדיקת זמן - ביטול אפשרי רק אם נשארו יותר מ-24 שעות
    const appointmentDate = check.rows[0].appointment_date;
    const now = new Date();
    const appointment = new Date(appointmentDate);
    const hoursDiff = (appointment - now) / 36e5;

    if (hoursDiff < 24) {
      return res.status(400).json({ error: 'לא ניתן לבטל פחות מ-24 שעות לפני מועד התור. נא פנה טלפונית.' });
    }

    await pool.query('DELETE FROM appointments WHERE id = $1', [appointmentId]);
    res.status(200).json({ message: 'התור בוטל בהצלחה.' });
  } catch (err) {
    console.error('❌ Error deleting appointment:', err);
    res.status(500).json({ error: 'Failed to delete appointment' });
  }
});

module.exports = router;
