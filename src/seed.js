// ✅ src/seed.js - Seed data generator (plate fix)
const db = require('./db');

// ✅ Clear existing data for clean seed
db.serialize(() => {
  db.run('DELETE FROM vehicles');
  db.run('DELETE FROM customers');
  db.run('DELETE FROM appointments');

  // ✅ Insert customers
  db.run(`INSERT INTO customers (name, phone, email) VALUES (?, ?, ?)`, [
    'John Doe', '0501234567', 'john@example.com'
  ], function (err) {
    if (err) return console.error(err);

    const customerId = this.lastID;

    // ✅ Insert vehicle with correct 'plate' column
    db.run(`INSERT INTO vehicles (customer_id, model, plate) VALUES (?, ?, ?)`, [
      customerId, 'Mazda 3', '12-345-67'
    ], function (err) {
      if (err) return console.error(err);

      const vehicleId = this.lastID;

      // ✅ Insert appointment
      db.run(`INSERT INTO appointments (customer_id, vehicle_id, service, date) VALUES (?, ?, ?, ?)`, [
        customerId, vehicleId, 'טיפול קטן', '2025-05-01'
      ], (err) => {
        if (err) return console.error(err);

        console.log('✅ SEED Data Inserted');
      });
    });
  });
});

// ✅ Close DB after completion
setTimeout(() => db.close(), 500);
