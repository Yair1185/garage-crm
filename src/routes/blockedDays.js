// ✅ src/routes/blockedDays.js - PostgreSQL Version
const express = require('express');
const router = express.Router();
const pool = require('../db');

// ✅ שליפת ימים חסומים
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM blocked_days ORDER BY date ASC');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('❌ Error fetching blocked days:', err);
    res.status(500).json({ error: 'Failed to fetch blocked days' });
  }
});

// ✅ הוספת יום לחסום
router.post('/block', async (req, res) => {
  const { date } = req.body;
  if (!date) return res.status(400).json({ error: 'Date is required' });

  try {
    await pool.query('INSERT INTO blocked_days (date) VALUES ($1) ON CONFLICT (date) DO NOTHING', [date]);
    res.status(201).json({ message: 'Day blocked successfully' });
  } catch (err) {
    console.error('❌ Error blocking day:', err);
    res.status(500).json({ error: 'Failed to block day' });
  }
});

// ✅ ביטול חסימה של יום
router.delete('/unblock/:date', async (req, res) => {
  const { date } = req.params;
  try {
    await pool.query('DELETE FROM blocked_days WHERE date = $1', [date]);
    res.status(200).json({ message: 'Day unblocked successfully' });
  } catch (err) {
    console.error('❌ Error unblocking day:', err);
    res.status(500).json({ error: 'Failed to unblock day' });
  }
});

module.exports = router;
