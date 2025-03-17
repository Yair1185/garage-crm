const express = require('express');
const router = express.Router();
const db = require('../db');

// הצגת כל הרכבים + טופס הוספה
router.get('/', (req, res) => {
    db.all(`SELECT * FROM customers`, [], (err, customers) => {
        if (err) {
            return res.send('Error fetching customers');
        }

        db.all(`
            SELECT vehicles.id, vehicles.model, vehicles.license_plate, customers.name AS customer_name 
            FROM vehicles 
            JOIN customers ON vehicles.customer_id = customers.id
        `, [], (err, vehicles) => {
            if (err) {
                return res.send('Error fetching vehicles');
            }

            res.render('vehicles', { title: 'Vehicles List', vehicles, customers });
        });
    });
});

// טיפול בטופס הוספת רכב
router.post('/add', (req, res) => {
    const { customer_id, model, license_plate } = req.body;
    db.run(`INSERT INTO vehicles (customer_id, model, license_plate) VALUES (?, ?, ?)`,
        [customer_id, model, license_plate],
        (err) => {
            if (err) {
                return res.send('Error adding vehicle');
            }
            res.redirect('/vehicles');
        });
});

module.exports = router;
