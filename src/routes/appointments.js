const express = require('express');
const router = express.Router();
const pool = require('../db');
const isCustomer = require('../middleware/isCustomer');
const dayjs = require('dayjs');

// ✅ יצירת תור
router.post('/',isCustomer, async (req, res) => {
  const { vehicle_id, appointment_date, appointment_time, service_type } = req.body;
  const customerId = req.session.customerId;

  if (!customerId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    // בדיקה אם היום חסום
    const blocked = await pool.query('SELECT * FROM blocked_days WHERE date = $1', [appointment_date]);
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

// ✅ תורים קודמים
router.get('/past', async (req, res) => {
  const customerId = req.session.customerId;
  if (!customerId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const customerResult = await pool.query(
      'SELECT name FROM customers WHERE id = $1',
      [customerId]
    );
    const name = customerResult.rows[0]?.name || 'לקוח';

    const result = await pool.query(`
      SELECT a.*, v.model, v.plate
      FROM appointments a
      JOIN vehicles v ON a.vehicle_id = v.id
      WHERE a.customer_id = $1
        AND (
          appointment_date < CURRENT_DATE
          OR (appointment_date = CURRENT_DATE AND appointment_time < CURRENT_TIME)
        )
      ORDER BY appointment_date DESC
    `, [customerId]);

    res.status(200).json({ name, appointments: result.rows });
  } catch (err) {
    console.error('❌ Error fetching past appointments:', err);
    res.status(500).json({ error: 'Failed to fetch past appointments' });
  }
});


// ✅ שליפת תורים של הלקוח
router.get('/my',isCustomer, async (req, res) => {
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


    await pool.query('DELETE FROM appointments WHERE id = $1', [appointmentId]);
    res.status(200).json({ message: 'התור בוטל בהצלחה.' });
  } catch (err) {
    console.error('❌ Error deleting appointment:', err);
    res.status(500).json({ error: 'Failed to delete appointment' });
  }
});

// ✅ שליפת תורים זמינים מהקאש לפי סוג שירות
router.get('/cached-slots', async (req, res) => {
  const { serviceType } = req.query;

  if (!serviceType) {
    return res.status(400).json({ error: 'Missing serviceType parameter' });
  }

  try {
    const result = await pool.query(
      `SELECT appointment_date, appointment_time
       FROM available_slots_cache
       WHERE service_type = $1
       ORDER BY appointment_date, appointment_time
       LIMIT 3`,
      [serviceType]
    );

    res.status(200).json(result.rows);
  } catch (err) {
    console.error('❌ Error fetching cached slots:', err);
    res.status(500).json({ error: 'Failed to fetch cached slots' });
  }
});

const SERVICE_DURATIONS = {
  'טיפול קטן': 1,
  'טיפול גדול': 2,
  'בדיקה ראשונית': 3,
  'תקלה': 3
};

const generateSlots = (duration) => {
  const slots = [];
  const OPEN = 7.5;
  const CLOSE = 14;

  for (let h = OPEN; h < CLOSE; h += 0.5) {
    const end = h + duration;
    if (end <= CLOSE) {
      const hour = Math.floor(h);
      const min = (h % 1) === 0 ? '00' : '30';
      slots.push(`${hour.toString().padStart(2, '0')}:${min}`);
    }
  }

  return slots;
};

const isSlotAvailable = (slot, duration, takenSlots) => {
  const [hour, min] = slot.split(':').map(Number);
  const start = hour + min / 60;
  const end = start + duration;

  for (const t of takenSlots) {
    const [tHour, tMin] = t.split(':').map(Number);
    const tStart = tHour + tMin / 60;
    const tEnd = tStart + 1;

    if (
      (start >= tStart && start < tEnd) ||
      (end > tStart && end <= tEnd) ||
      (start <= tStart && end >= tEnd)
    ) return false;
  }

  return true;
};

router.get('/available-dates', async (req, res) => {
  const { serviceType } = req.query;
  if (!serviceType || !SERVICE_DURATIONS[serviceType]) {
    return res.status(400).json({ error: 'Missing or invalid serviceType' });
  }

  const duration = SERVICE_DURATIONS[serviceType];
  const availableDates = [];

  try {
    const blockedRes = await pool.query('SELECT date FROM blocked_days');
    const blockedDates = blockedRes.rows.map(row => row.date.toISOString().split('T')[0]);

    for (let i = 0; i < 150; i++) {
      const dateObj = dayjs().add(i, 'day');
      const dateStr = dateObj.format('YYYY-MM-DD');
      const weekday = dateObj.day(); // 6 = Saturday

      if (weekday === 6 || blockedDates.includes(dateStr)) continue;

      const takenRes = await pool.query(
        'SELECT appointment_time FROM appointments WHERE appointment_date = $1',
        [dateStr]
      );
      const taken = takenRes.rows.map(r => r.appointment_time);

      const slots = generateSlots(duration);
      const hasAvailable = slots.some(slot => isSlotAvailable(slot, duration, taken));

      if (hasAvailable) {
        availableDates.push(dateStr);
      }
    }

    res.status(200).json(availableDates);
  } catch (err) {
    console.error('❌ Error fetching available dates:', err);
    res.status(500).json({ error: 'Failed to fetch available dates' });
  }
});

module.exports = router;
