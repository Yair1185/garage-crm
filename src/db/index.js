// ✅ src/db/index.js - PostgreSQL Pool
const { Pool } = require('pg');

// ניתן להחליף ל-process.env.* עבור סביבה
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'garage_crm',
  password: '1234',  // שים לב - לשים ב .env בפרודקשן
  port: 5432,        // ברירת מחדל PostgreSQL
});

// בדיקת חיבור
pool.connect()
  .then(() => console.log('✅ PostgreSQL Connected'))
  .catch(err => console.error('❌ Connection Error:', err));

module.exports = pool;
