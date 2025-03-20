// ✅ src/routes/manager.js - PostgreSQL Version
const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');

// ✅ התחברות מנהל
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Username and password are required' });

  try {
    const result = await pool.query('SELECT * FROM admin WHERE username = $1', [username]);
    const admin = result.rows[0];
    if (!admin || !bcrypt.compareSync(password, admin.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    req.session.managerId = admin.id;
    res.status(200).json({ message: 'Login successful' });
  } catch (err) {
    console.error('❌ Manager login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// ✅ Middleware הגנה לכל המסלולים למעט login ו logout
router.use((req, res, next) => {
  if (!req.session.managerId && req.path !== '/login' && req.path !== '/logout') {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
});

// ✅ Dashboard נתונים
router.get('/dashboard', async (req, res) => {
  try {
    const customers = await pool.query('SELECT COUNT(*) FROM customers');
    const vehicles = await pool.query('SELECT COUNT(*) FROM vehicles');
    const appointments = await pool.query('SELECT COUNT(*) FROM appointments');
    const commonService = await pool.query(`
      SELECT service, COUNT(service) AS count 
      FROM appointments 
      GROUP BY service 
      ORDER BY count DESC 
      LIMIT 1
    `);

    res.status(200).json({
      stats: {
        totalCustomers: Number(customers.rows[0].count),
        totalVehicles: Number(vehicles.rows[0].count),
        totalAppointments: Number(appointments.rows[0].count),
        mostCommonService: commonService.rows[0]?.service || 'N/A'
      }
    });
  } catch (err) {
    console.error('❌ Error fetching manager dashboard:', err);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// ✅ Logout מנהל
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.status(200).json({ message: 'Logged out successfully' });
});

module.exports = router;
