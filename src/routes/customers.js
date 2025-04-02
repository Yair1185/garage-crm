// ✅ src/routes/customers.js - PostgreSQL + JSON API
const express = require('express');
const router = express.Router();
const pool = require('../db');
const isCustomer = require('../middleware/isCustomer');
// ✅ רישום לקוח חדש
router.post('/register', async (req, res) => {
  const { name, phone, email, model, plate } = req.body;

  if (!name || !phone || !email || !model || !plate) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const customerResult = await pool.query(
      `INSERT INTO customers (name, phone, email) VALUES ($1, $2, $3) RETURNING id`,
      [name, phone, email]
    );
    const customerId = customerResult.rows[0].id;

    await pool.query(
      `INSERT INTO vehicles (customer_id, model, plate) VALUES ($1, $2, $3)`,
      [customerId, model, plate]
    );

    res.status(201).json({ message: 'Customer registered successfully', customerId });
  } catch (err) {
    console.error('❌ Error registering customer:', err);
    res.status(500).json({ error: 'Failed to register customer' });
  }
});

router.post('/login', async (req, res) => {
  const { phone, plate } = req.body;

  if (!phone || !plate) {
    return res.status(400).json({ error: 'Phone and Plate are required' });
  }

  const sql = `
    SELECT customers.id AS customer_id
    FROM customers
    JOIN vehicles ON customers.id = vehicles.customer_id
    WHERE customers.phone = $1 AND vehicles.plate = $2
  `;

  try {
    const result = await pool.query(sql, [phone, plate]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // ✅ שמירת סשן והמתנה לסיום
    req.session.customerId = result.rows[0].customer_id;

    req.session.save((err) => {
      if (err) {
        console.error('❌ Session save failed:', err);
        return res.status(500).json({ error: 'Session error' });
      }

      console.log('✅ Session saved:', req.session);
      res.status(200).json({ message: 'Login successful' });
    });

  } catch (err) {
    console.error('❌ Login error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});


// ✅ Dashboard לקוח
router.get('/dashboard',isCustomer, async (req, res) => {
  if (!req.session.customerId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const customerResult = await pool.query(`SELECT * FROM customers WHERE id = $1`, [req.session.customerId]);
    const vehiclesResult = await pool.query(`SELECT * FROM vehicles WHERE customer_id = $1`, [req.session.customerId]);
    const appointmentsResult = await pool.query(`
      SELECT a.*, v.model AS vehicle_model, v.plate FROM appointments a
      JOIN vehicles v ON a.vehicle_id = v.id
      WHERE a.customer_id = $1
    `, [req.session.customerId]);

    res.status(200).json({
      customer: customerResult.rows[0],
      vehicles: vehiclesResult.rows,
      appointments: appointmentsResult.rows
    });
  } catch (err) {
    console.error('❌ Error fetching dashboard:', err);
    res.status(500).json({ error: 'Failed to fetch dashboard' });
  }
  console.log('✅ Current Session:', req.session);
});

// ✅ עדכון פרטי לקוח ורכב
router.put('/update-profile', async (req, res) => {
  const customerId = req.session.customerId;
  const { customer, vehicles } = req.body;

  if (!customerId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    // עדכון טלפון ואימייל
    await pool.query(
      `UPDATE customers SET phone = $1, email = $2 WHERE id = $3`,
      [customer.phone, customer.email, customerId]
    );

    // עדכון רכבים
    for (const v of vehicles) {
      await pool.query(
        `UPDATE vehicles SET model = $1, plate = $2 WHERE id = $3 AND customer_id = $4`,
        [v.model, v.plate, v.id, customerId]
      );
    }

    res.status(200).json({ message: 'הפרטים עודכנו בהצלחה!' });
  } catch (err) {
    console.error('❌ Error updating profile:', err);
    res.status(500).json({ error: 'שגיאה בעדכון הפרטים' });
  }
});


// ✅ עדכון פרטי לקוח ורכב
router.put('/update',isCustomer, async (req, res) => {
  const customerId = req.session.customerId;
  const { phone, email, vehicles } = req.body;

  if (!customerId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    await pool.query(`UPDATE customers SET phone = $1, email = $2 WHERE id = $3`, [phone, email, customerId]);

    for (const v of vehicles) {
      await pool.query(`UPDATE vehicles SET model = $1, plate = $2 WHERE id = $3 AND customer_id = $4`, [v.model, v.plate, v.id, customerId]);
    }

    res.status(200).json({ message: 'פרטים עודכנו בהצלחה' });
  } catch (err) {
    console.error("❌ Error updating customer info:", err);
    res.status(500).json({ error: 'שגיאה בעדכון פרטים' });
  }
});

// ✅ הוספת רכב ללקוח
router.post('/add-vehicle', async (req, res) => {
  const { customer_id, model, plate } = req.body;

  if (!customer_id || !model || !plate) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    await pool.query(
      `INSERT INTO vehicles (customer_id, model, plate) VALUES ($1, $2, $3)`,
      [customer_id, model, plate]
    );
    res.status(200).json({ message: 'Vehicle added successfully' });
  } catch (err) {
    console.error('❌ Error adding vehicle:', err);
    res.status(500).json({ error: 'Failed to add vehicle' });
  }
});

// ✅ התנתקות
router.get('/logout',isCustomer, (req, res) => {
  req.session.destroy();
  res.status(200).json({ message: 'Logged out successfully' });
});

// ✅ בדיקת התחברות לקוח
router.get('/check-auth', (req, res) => {
  console.log('SESSION DEBUG:', req.session); // 👈
  if (req.session?.customerId) {
    return res.sendStatus(200);
  }
  return res.sendStatus(401);
});

module.exports = router;