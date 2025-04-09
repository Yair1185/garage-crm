const pool = require('../db');
const dayjs = require('dayjs');

const SERVICE_DURATIONS = {
  'טיפול קטן': 1,
  'טיפול גדול': 2,
  'בדיקה ראשונית': 3,
  'תקלה': 3
};

const MAX_APPOINTMENTS_PER_DAY = 8;
const MAX_RESULTS = 3;
const OPEN_HOUR = 7.5;
const CLOSE_HOUR = 14;

const getBlockedDates = async () => {
  const res = await pool.query('SELECT date FROM blocked_days');
  return res.rows.map(r => r.date.toISOString().split('T')[0]);
};

const getAppointmentsByDate = async (date) => {
  const res = await pool.query('SELECT appointment_time FROM appointments WHERE appointment_date = $1', [date]);
  return res.rows.map(r => r.appointment_time);
};

const generateSlots = (duration) => {
  const slots = [];
  for (let h = OPEN_HOUR; h < CLOSE_HOUR; h += 0.5) {
    const end = h + duration;
    if (end <= CLOSE_HOUR) {
      const hour = Math.floor(h);
      const minute = (h % 1) * 60;
      slots.push(`${hour.toString().padStart(2, '0')}:${minute === 0 ? '00' : '30'}`);
    }
  }
  return slots;
};

const isSlotAvailable = (slot, duration, takenSlots) => {
  const [hour, minute] = slot.split(':').map(Number);
  const start = hour + (minute / 60);
  const end = start + duration;

  for (let t of takenSlots) {
    const [tHour, tMin] = t.split(':').map(Number);
    const tStart = tHour + (tMin / 60);
    const tEnd = tStart + 1; // assume existing appointments are always 1 hour
    if (
      (start >= tStart && start < tEnd) ||
      (end > tStart && end <= tEnd) ||
      (start <= tStart && end >= tEnd)
    ) return false;
  }
  return true;
};

const cacheAvailableSlots = async () => {
  try {
    await pool.query('DELETE FROM available_slots_cache');
    const blockedDates = await getBlockedDates();

    for (const serviceType of Object.keys(SERVICE_DURATIONS)) {
      const duration = SERVICE_DURATIONS[serviceType];
      const available = [];

      for (let i = 0; i < 150 && available.length < MAX_RESULTS; i++) {
        const dateObj = dayjs().add(i, 'day');
        const weekday = dateObj.day();
        const dateStr = dateObj.format('YYYY-MM-DD');

        if (weekday === 6 || blockedDates.includes(dateStr)) continue;

        const taken = await getAppointmentsByDate(dateStr);
        const slots = generateSlots(duration);

        for (let slot of slots) {
          if (isSlotAvailable(slot, duration, taken)) {
            available.push({ serviceType, date: dateStr, time: slot });
            break; // רק אחד ליום
          }
        }
      }

      for (const slot of available) {
        await pool.query(
          `INSERT INTO available_slots_cache (service_type, appointment_date, appointment_time)
           VALUES ($1, $2, $3)`,
          [slot.serviceType, slot.date, slot.time]
        );
      }
    }

    console.log('✅ Cached slots generated successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Failed to generate cached slots:', err);
    process.exit(1);
  }
};

cacheAvailableSlots();
