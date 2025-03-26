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

// ✅ גרף: תורים עתידיים לפי יום
router.get('/appointments-per-day', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT appointment_date AS date, COUNT(*) AS count
      FROM appointments
      WHERE appointment_date >= CURRENT_DATE
      GROUP BY appointment_date
      ORDER BY appointment_date
      LIMIT 7
    `);

    res.status(200).json(result.rows);
  } catch (err) {
    console.error('❌ Error fetching appointment stats:', err);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

// ✅ התחברות מנהל לפי שם משתמש וסיסמה
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'יש להזין שם משתמש וסיסמה' });
  }

  try {
    const result = await pool.query('SELECT * FROM admin WHERE username = $1', [username]);
    const admin = result.rows[0];

    if (!admin || admin.password !== password) {
      return res.status(401).json({ error: 'שם משתמש או סיסמה שגויים' });
    }

    // שמירת מזהה המנהל ב-session
    req.session.admin = { id: admin.id, username: admin.username };

    res.status(200).json({ message: 'ברוך הבא, מנהל!' });
  } catch (err) {
    console.error('❌ שגיאה בהתחברות מנהל:', err);
    res.status(500).json({ error: 'שגיאה בהתחברות' });
  }
});


// ✅ Middleware הגנה לכל המסלולים למעט login ו logout
router.use((req, res, next) => {
  if (!req.session.managerId && req.path !== '/login' && req.path !== '/logout') {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
});

// ✅ יצירת מנהל חדש
router.post('/add-admin', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'יש למלא את כל השדות' });
  }

  try {
    // האם המשתמש כבר קיים?
    const existing = await pool.query('SELECT * FROM admin WHERE username = $1', [username]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'שם המשתמש כבר קיים' });
    }

    // יצירת מנהל חדש
    await pool.query(
      'INSERT INTO admin (username, password) VALUES ($1, $2)',
      [username, password]
    );

    res.status(201).json({ message: 'המנהל נוצר בהצלחה' });
  } catch (err) {
    console.error('❌ שגיאה ביצירת מנהל:', err);
    res.status(500).json({ error: 'שגיאה ביצירת מנהל חדש' });
  }
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
