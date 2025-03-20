const express = require('express');
const router = express.Router();
const pool = require('../db'); // PostgreSQL

// 📌 הצגת כל הימים החסומים
router.get('/', (req, res) => {
  db.query(`SELECT * FROM blocked_days`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(rows);
  });
});

// 📌 חסימת יום לתיאום
router.post('/block', (req, res) => {
  if (!req.session.isAdmin) {
    return res.status(403).json({ error: "גישה חסומה" });
  }

  const { date } = req.body;
  if (!date) return res.status(400).json({ error: "תאריך חסר" });

  db.query(`INSERT INTO blocked_days (date) VALUES (?)`, [date], function (err) {
    if (err) return res.status(500).json({ error: "Failed to block date" });
    res.status(201).json({ message: "התאריך נחסם", id: this.lastID });
  });
});

// 📌 ביטול חסימה של יום
router.delete('/unblock/:date', (req, res) => {
  if (!req.session.isAdmin) {
    return res.status(403).json({ error: "גישה חסומה" });
  }

  const { date } = req.params;
  db.query(`DELETE FROM blocked_days WHERE date = ?`, [date], function (err) {
    if (err) return res.status(500).json({ error: "Failed to unblock date" });
    res.json({ message: "החסימה בוטלה" });
  });
});

module.exports = router;
