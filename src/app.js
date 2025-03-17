const express = require('express');
const session = require('express-session');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./db');
const expressLayouts = require('express-ejs-layouts'); // חבילת עיצובים
const helmet = require('helmet');
123456
const PORT = 5000;

app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", "default-src *; script-src * 'unsafe-inline' 'unsafe-eval'; style-src * 'unsafe-inline'; font-src *;");
    next();
});

app.use(session({
    secret: 'mysecretkey', // מפתח הסשן
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // הפוך ל-true אם זה HTTPS
}));


// הגדרות
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));  // מוודא ש-Tailwind ו-CSS נטענים
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressLayouts); // ✅ חובה כדי שה-layout יעבוד
app.set('layout', 'layout'); // 📌 הגדרת layout ברירת מחדל


// ייבוא מסלולים
const customerRoutes = require('./routes/customers');
const vehicleRoutes = require('./routes/vehicles');
const appointmentRoutes = require('./routes/appointments');
const userRoutes = require('./routes/users');
const managerRoutes = require('./routes/manager');

// שימוש במסלולים
app.use('/customers', customerRoutes);
app.use('/vehicles', vehicleRoutes);
app.use('/appointments', appointmentRoutes);
app.use('/users', userRoutes);
app.use('/manager', managerRoutes);

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"]
        }
    }
}));

app.get('/', (req, res) => {
    res.render('home', { title: "ברוכים הבאים למוסך מרכבת המשנה" });
});

app.get('/customers/login', (req, res) => {
    res.render('login', { title: "כניסת לקוחות" });
});

app.get('/manager/login', (req, res) => {
    res.render('manager-login', { title: "כניסת מנהלים" });
});

app.get('/customers/signup', (req, res) => {
    res.render('signup', { title: "הרשמה ללקוחות" });
});
// הפעלת השרת
app.listen(5000, () => {
    console.log('Server running on http://localhost:5000');
});