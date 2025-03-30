// ✅ src/db/index.js - PostgreSQL Pool
const { Pool } = require('pg');

// ניתן להחליף ל-process.env.* עבור סביבה
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// בדיקת חיבור
pool.connect()
  .then(() => {
    console.log('✅ PostgreSQL Connected');
    console.log('✅ Connected to database:', pool.options.database || process.env.DATABASE_URL);
  })
  .catch(err => console.error('❌ Connection Error:', err));

module.exports = pool;
