const express = require('express');
const router = express.Router();
const db = require('../db');

// 📌 עמוד הרשמה
router.get('/signup', (req, res) => {
    res.render('signup', { error: null });
});

// 📌 טיפול בהרשמה
router.post('/signup', (req, res) => {
    console.log("📌 נתונים שהתקבלו בהרשמה:", req.body); // ✅ בדיקה

    const { name, phone, email, model, license_plate } = req.body;

    if (!name || !phone || !model || !license_plate) {
        console.error("❌ שדות חסרים:", req.body);
        return res.status(400).json({ success: false, message: "שגיאה: כל השדות חובה." });
    }

    db.serialize(() => {
        db.run(
            `INSERT INTO customers (name, phone, email) VALUES (?, ?, ?)`,
            [name, phone, email],
            function (err) {
                if (err) {
                    console.error("❌ שגיאה בהכנסת לקוח:", err);
                    return res.status(500).json({ success: false, message: "שגיאה בהרשמה, נסה שוב." });
                }

                const customerId = this.lastID;

                db.run(
                    `INSERT INTO vehicles (customer_id, model, license_plate) VALUES (?, ?, ?)`,
                    [customerId, model, license_plate],
                    (err) => {
                        if (err) {
                            console.error("❌ שגיאה בהוספת רכב:", err);
                            return res.status(500).json({ success: false, message: "שגיאה בהוספת רכב." });
                        }

                        console.log("✅ הרשמה הצליחה!");
                        res.status(200).json({ success: true, message: "ההרשמה הצליחה! כעת ניתן להתחבר." });
                    }
                );
            }
        );
    });
});

// 📌 עמוד התחברות ללקוחות
router.get('/login', (req, res) => {
    res.render('login', { error: null });
});

// 📌 טיפול בהתחברות ושמירת סשן
router.post('/login', (req, res) => {
    const { phone, license_plate } = req.body;

    db.get(
        `SELECT customers.id AS customer_id, customers.name 
         FROM customers
         JOIN vehicles ON customers.id = vehicles.customer_id
         WHERE customers.phone = ? AND vehicles.license_plate = ?`,
        [phone, license_plate],
        (err, user) => {
            if (err) {
                console.error('❌ שגיאה במסד הנתונים:', err);
                return res.render('login', { error: 'שגיאה במסד הנתונים' });
            }

            if (!user) {
                return res.render('login', { error: 'פרטי ההתחברות שגויים.' });
            }

            req.session.customerId = user.customer_id;
            console.log('✅ התחברות לקוח:', req.session);
            res.redirect('/customers/dashboard');
        }
    );
});

// 📌 מסלול הדשבורד
router.get('/dashboard', (req, res) => {
    if (!req.session.customerId) {
        return res.redirect('/customers/login');
    }

    const customerId = req.session.customerId;

    db.get(`SELECT * FROM customers WHERE id = ?`, [customerId], (err, customer) => {
        if (err || !customer) return res.send('❌ שגיאה בשליפת נתוני הלקוח.');

        db.all(`SELECT * FROM vehicles WHERE customer_id = ?`, [customerId], (err, vehicles) => {
            if (err) return res.send('❌ שגיאה בשליפת רכבים.');

            db.all(
                `SELECT * FROM appointments WHERE vehicle_id IN (SELECT id FROM vehicles WHERE customer_id = ?)`,
                [customerId],
                (err, appointments) => {
                    if (err) return res.send('❌ שגיאה בשליפת תורים.');

                    res.render('customer-dashboard', { customer, vehicles, appointments });
                }
            );
        });
    });
});

// 📌 טיפול בהוספת רכב
router.post('/add-vehicle', (req, res) => {
    const { customer_id, model, license_plate } = req.body;

    db.run(
        `INSERT INTO vehicles (customer_id, model, license_plate) VALUES (?, ?, ?)`,
        [customer_id, model, license_plate],
        (err) => {
            if (err) {
                return res.send('❌ שגיאה בהוספת רכב: ' + err.message);
            }
            res.redirect('/customers/dashboard');
        }
    );
});

router.get('/dashboard', (req, res) => {
    if (!req.session.customerId) {
        return res.redirect('/customers/login');
    }

    const customerId = req.session.customerId;

    db.get(`SELECT COUNT(*) AS totalAppointments FROM appointments WHERE vehicle_id IN (SELECT id FROM vehicles WHERE customer_id = ?)`, 
        [customerId], (err, totalAppointments) => {
            if (err) return res.send('שגיאה בשליפת סטטיסטיקות.');

            db.get(`SELECT service, COUNT(service) AS count FROM appointments WHERE vehicle_id IN (SELECT id FROM vehicles WHERE customer_id = ?) GROUP BY service ORDER BY count DESC LIMIT 1`,
                [customerId], (err, mostCommonService) => {
                    
                    db.get(`SELECT date FROM appointments WHERE vehicle_id IN (SELECT id FROM vehicles WHERE customer_id = ?) ORDER BY date ASC LIMIT 1`,
                        [customerId], (err, nextAppointment) => {
                            
                            res.render('customer-dashboard', {
                                customer: req.session.customer,
                                vehicles: req.session.vehicles,
                                appointments: req.session.appointments,
                                stats: {
                                    totalAppointments: totalAppointments ? totalAppointments.totalAppointments : 0,
                                    mostCommonService: mostCommonService ? mostCommonService.service : "לא זמין",
                                    nextAppointment: nextAppointment ? nextAppointment.date : "אין תור קרוב"
                                }
                            });
                        });
                });
        });
});


// 📌 התנתקות
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;
