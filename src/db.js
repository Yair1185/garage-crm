const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

// סיסמה מוצפנת למנהל
const hashedPassword = bcrypt.hashSync('1234', 10);

const db = new sqlite3.Database('./garage.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error('❌ שגיאה בחיבור למסד הנתונים:', err.message);
    } else {
        console.log('✅ חיבור למסד הנתונים נוצר בהצלחה.');
    }
});
db.configure("busyTimeout", 5000);

db.serialize(() => {
    // יצירת טבלת לקוחות
    db.run(`
        CREATE TABLE IF NOT EXISTS customers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            phone TEXT,
            email TEXT
        )
    `);

    // יצירת טבלת רכבים
    db.run(`
        CREATE TABLE IF NOT EXISTS vehicles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            customer_id INTEGER,
            model TEXT NOT NULL,
            license_plate TEXT UNIQUE NOT NULL,
            treatment_history TEXT,
            FOREIGN KEY (customer_id) REFERENCES customers(id)
        )
    `);

    // יצירת טבלת תורים
    db.run(`
        CREATE TABLE IF NOT EXISTS appointments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            customer_id INTEGER,
            vehicle_id INTEGER,
            service TEXT NOT NULL,
            date TEXT NOT NULL,
            status TEXT DEFAULT 'Scheduled',
            FOREIGN KEY (customer_id) REFERENCES customers(id),
            FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
        )
    `);

    // יצירת טבלת מנהלים
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL
        )
    `);

    // הוספת משתמש מנהל אם לא קיים
    db.get(`SELECT * FROM users WHERE username = ?`, ['admin'], (err, row) => {
        if (err) {
            console.error('Error checking admin user:', err.message);
        } else if (!row) {
            db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, ['admin', hashedPassword], (err) => {
                if (err) {
                    console.error('Error inserting admin user:', err.message);
                } else {
                    console.log('Admin user created successfully.');
                }
            });
        } else {
            console.log('Admin user already exists.');
        }
    });

    // יצירת טבלת משתמשי לקוחות
    db.run(`
        CREATE TABLE IF NOT EXISTS customers_users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            phone TEXT NOT NULL UNIQUE,
            customer_id INTEGER,
            FOREIGN KEY (customer_id) REFERENCES customers(id)
        )
    `);
});

module.exports = db;
