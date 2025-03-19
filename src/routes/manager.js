const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');

// ✅ התחברות מנהל
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.get(`SELECT * FROM admin WHERE username = ?`, [username], (err, user) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    req.session.managerId = user.id;
    res.status(200).json({ message: "Manager logged in successfully" });
  });
});

// ✅ Middleware להגנה על נתיבים פרטיים
router.use((req, res, next) => {
  if (!req.session.managerId && req.path !== '/login' && req.path !== '/logout') {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
});

// ✅ Dashboard מנהל - סטטיסטיקות ונתונים
router.get('/dashboard', async (req, res) => {
  try {
    db.get(`SELECT COUNT(*) AS total FROM customers`, (err, totalCustomers) => {
      db.get(`SELECT COUNT(*) AS total FROM vehicles`, (err, totalVehicles) => {
        db.get(`SELECT COUNT(*) AS total FROM appointments`, (err, totalAppointments) => {
          db.get(`SELECT service FROM appointments GROUP BY service ORDER BY COUNT(service) DESC LIMIT 1`, (err, mostCommonService) => {

            db.all(`SELECT * FROM customers`, [], (err, customers) => {
              db.all(`SELECT * FROM vehicles`, [], (err, vehicles) => {

                res.status(200).json({
                  stats: {
                    totalCustomers: totalCustomers.total,
                    totalVehicles: totalVehicles.total,
                    totalAppointments: totalAppointments.total,
                    mostCommonService: mostCommonService ? mostCommonService.service : "N/A"
                  },
                  customers,
                  vehicles
                });
              });
            });

          });
        });
      });
    });
  } catch (error) {
    console.error("❌ Manager dashboard error:", error);
    res.status(500).json({ error: "Failed to load dashboard" });
  }
});

// ✅ התנתקות מנהל
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.status(200).json({ message: "Manager logged out successfully" });
});

module.exports = router;
