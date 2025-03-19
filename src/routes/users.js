const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');

// טופס התחברות מנהל
router.get('/login', (req, res) => {
    res.render('admin-login', { error: null });
});

// טיפול בטופס התחברות מנהל
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.query('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.render('admin-login', { error: 'שם משתמש או סיסמה שגויים.' });
        }

        res.redirect('/manager/dashboard');
    });
});

// טופס התחברות
router.get('/login', (req, res) => {
    res.render('login', { error: null });
});

// טיפול בטופס התחברות
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, user) => {
        if (err) {
            return res.render('login', { error: 'Database error.' });
        }
        if (!user) {
            return res.render('login', { error: 'Invalid credentials.' });
        }

        res.redirect('/users/manager');
    });
});

// דף ניהול לאחר התחברות
router.get('/manager', (req, res) => {
    res.send('Welcome, Manager!');
});

module.exports = router;
