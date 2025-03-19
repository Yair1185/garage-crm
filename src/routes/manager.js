const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');

// 📌 טופס התחברות למנהל
router.get('/login', (req, res) => {
    if (req.session.managerId) {
        return res.redirect('/manager/dashboard'); // אם מחובר, להפנות לדשבורד
    }
    res.render('manager-login', { error: null });
});

// 📌 התחברות מנהל
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, user) => {
        if (err) {
            console.error('❌ Database error:', err);
            return res.render('manager-login', { error: 'שגיאה במסד הנתונים' });
        }

        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.render('manager-login', { error: 'שם משתמש או סיסמה שגויים' });
        }

        req.session.managerId = user.id;
        console.log('✅ מנהל מחובר:', req.session);
        res.redirect('/manager/dashboard');
    });
});

// 📌 Middleware: מגביל גישה לדפים פרט ל-`/login`
router.use((req, res, next) => {
    if (!req.session.managerId && req.path !== '/login' && req.path !== '/logout') {
        return res.redirect('/manager/login');
    }
    next();
});
router.get('/dashboard', async (req, res) => {
    try {
        // שליפת נתוני הסטטיסטיקות
        const totalCustomers = await db.get(`SELECT COUNT(*) AS total FROM customers`) || { total: 0 };
        const totalVehicles = await db.get(`SELECT COUNT(*) AS total FROM vehicles`) || { total: 0 };
        const totalAppointments = await db.get(`SELECT COUNT(*) AS total FROM appointments`) || { total: 0 };
        const mostCommonService = await db.get(`
            SELECT service FROM appointments 
            GROUP BY service 
            ORDER BY COUNT(service) DESC 
            LIMIT 1
        `) || { service: "לא זמין" };

        // שליפת רשימת כל הלקוחות
        const customers = await new Promise((resolve, reject) => {
            db.all(`SELECT * FROM customers`, [], (err, rows) => {
                if (err) reject(err);
                resolve(rows || []);
            });
        });

        // שליפת רשימת הרכבים (שיהיה ניתן לחפש לקוחות לפי מספר רכב)
        const vehicles = await new Promise((resolve, reject) => {
            db.all(`SELECT * FROM vehicles`, [], (err, rows) => {
                if (err) reject(err);
                resolve(rows || []);
            });
        });

        console.log("📌 רשימת לקוחות:", customers);
        console.log("📌 רשימת רכבים:", vehicles);

        // שליחת הנתונים לעמוד
        res.render('manager-dashboard', {
            stats: {
                totalCustomers: totalCustomers.total,
                totalVehicles: totalVehicles.total,
                totalAppointments: totalAppointments.total,
                mostCommonService: mostCommonService.service
            },
            customers,
            vehicles
        });

    } catch (error) {
        console.error("❌ שגיאה בטעינת נתוני הניהול:", error);
        res.send("❌ שגיאה בטעינת הנתונים.");
    }
});



// 📌 התנתקות מנהל
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/manager/login');
});

module.exports = router;
