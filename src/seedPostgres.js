// ✅ src/seedPostgres.js - PostgreSQL SEED Script
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function seed() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // ✅ Clean old data
    await client.query('DELETE FROM appointments');
    await client.query('DELETE FROM vehicles');
    await client.query('DELETE FROM customers');

    // ✅ Insert customer
    const customerResult = await client.query(
      `INSERT INTO customers (name, phone, email) VALUES ($1, $2, $3) RETURNING id`,
      ['John Doe', '0501234567', 'john@example.com']
    );
    const customerId = customerResult.rows[0].id;

    // ✅ Insert vehicle
    const vehicleResult = await client.query(
      `INSERT INTO vehicles (customer_id, model, plate) VALUES ($1, $2, $3) RETURNING id`,
      [customerId, 'Mazda 3', '12-345-67']
    );
    const vehicleId = vehicleResult.rows[0].id;

    // ✅ Insert appointment
    await client.query(
      `INSERT INTO appointments (customer_id, vehicle_id, service, date) VALUES ($1, $2, $3, $4)`,
      [customerId, vehicleId, 'טיפול קטן', '2025-05-01']
    );

    await client.query('COMMIT');
    console.log('✅ PostgreSQL SEED Data Inserted');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ SEED Error:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
