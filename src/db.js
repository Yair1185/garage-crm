const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
require('dotenv').config();

const db = new sqlite3.Database('./garage.db', (err) => {
  if (err) {
    console.error("❌ Database connection failed:", err.message);
  } else {
    console.log("✅ Connected to SQLite database.");
  }
});

// 📌 יצירת טבלאות
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS vehicles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id INTEGER NOT NULL,
      model TEXT NOT NULL,
      plate TEXT UNIQUE NOT NULL,
      FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id INTEGER NOT NULL,
      vehicle_id INTEGER NOT NULL,
      service TEXT NOT NULL,
      date TEXT NOT NULL,
      status TEXT DEFAULT 'scheduled',
      FOREIGN KEY (customer_id) REFERENCES customers(id),
      FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS admin (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    )
  `);

  // 📌 בדיקה אם מנהל קיים, אם לא - יצירת אחד עם סיסמה מוצפנת
  db.get(`SELECT * FROM admin WHERE username = ?`, ["admin"], (err, row) => {
    if (!row) {
      const hashedPassword = bcrypt.hashSync(process.env.ADMIN_PASSWORD || "1234", 10);
      db.run(`INSERT INTO admin (username, password) VALUES (?, ?)`, ["admin", hashedPassword]);
      console.log("✅ Admin user created.");
    }
  });
});

module.exports = db;
