// ✅ src/db/index.js - PostgreSQL Pool
const { Pool } = require('pg');

// ניתן להחליף ל-process.env.* עבור סביבה
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// בדיקת חיבור
pool.connect()
  .then(() => console.log('✅ PostgreSQL Connected'))
  .catch(err => console.error('❌ Connection Error:', err));

module.exports = pool;
