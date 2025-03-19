// ✅ src/db.js - PostgreSQL Pool
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // להסרה ב-local
});

db.query(`SELECT * FROM customers WHERE id = $1`, [customerId])
  .then(result => result.rows[0])
  .catch(err => console.error(err));


module.exports = pool;
