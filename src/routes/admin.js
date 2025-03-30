// ✅ src/routes/admin.js - PostgreSQL Version
const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const isAdmin = require('../middleware/isAdmin');


// ✅ גרף: תורים עתידיים לפי יום
router.get('/appointments-per-day',isAdmin, async (req, res) => {
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

    if (!admin) {
      return res.status(401).json({ error: 'שם משתמש או סיסמה שגויים' });
    }

    const match = await bcrypt.compare(password, admin.password);

    if (!match) {
      return res.status(401).json({ error: 'שם משתמש או סיסמה שגויים' });
    }

    req.session.admin = { id: admin.id, username: admin.username };
    console.log("✅ התחברות מנהל הצליחה", req.session.admin); // הוספה לבדיקה
    res.status(200).json({ message: 'ברוך הבא, מנהל!' });
  } catch (err) {
    console.error('❌ שגיאה בהתחברות מנהל:', err);
    res.status(500).json({ error: 'שגיאה בהתחברות' });
  }
});


// ✅ יצירת מנהל חדש
router.post('/add-admin',isAdmin, async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'יש למלא את כל השדות' });
  }

  try {
    const existing = await pool.query('SELECT * FROM admin WHERE username = $1', [username]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'שם המשתמש כבר קיים' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      'INSERT INTO admin (username, password) VALUES ($1, $2)',
      [username, hashedPassword]
    );

    res.status(201).json({ message: 'המנהל נוצר בהצלחה' });
  } catch (err) {
    console.error('❌ שגיאה ביצירת מנהל:', err);
    res.status(500).json({ error: 'שגיאה ביצירת מנהל חדש' });
  }
});

// ✅ Dashboard נתונים
router.get('/dashboard', isAdmin,async (req, res) => {
  console.log("📦 req.session:", req.session); // נראה מה באמת נשלח
  try {
    const customers = await pool.query('SELECT COUNT(*) FROM customers');
    const vehicles = await pool.query('SELECT COUNT(*) FROM vehicles');
    const appointments = await pool.query('SELECT COUNT(*) FROM appointments');
    const commonService = await pool.query(`
      SELECT service_type, COUNT(service_type) AS count 
      FROM appointments 
      GROUP BY service_type  
      ORDER BY count DESC 
      LIMIT 1
    `);

    res.status(200).json({
      stats: {
        totalCustomers: Number(customers.rows[0].count),
        totalVehicles: Number(vehicles.rows[0].count),
        totalAppointments: Number(appointments.rows[0].count),
        mostCommonService: commonService.rows[0]?.service_type || 'N/A'
      }
    });
  } catch (err) {
    console.error('❌ Error fetching admin dashboard:', err);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// ✅ Logout מנהל
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.status(200).json({ message: 'Logged out successfully' });
});

// ✅ src/routes/admin.js
router.get('/check-auth', (req, res) => {
  if (req.session && req.session.admin) {
    res.status(200).json({ authenticated: true });
  } else {
    res.status(401).json({ authenticated: false });
  }
});

module.exports = router;
