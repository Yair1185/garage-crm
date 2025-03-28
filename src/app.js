require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const customerRoutes = require('./routes/customers');
const appointmentRoutes = require('./routes/appointments');
const managerRoutes = require('./routes/manager');
const db = require('./db'); // מעכשיו PostgreSQL

const blockedRoutes = require('./routes/blockedDays');
const app = express();

app.use(session({
  secret: process.env.SESSION_SECRET || "supersecret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,           // false כי אתה לא על HTTPS (אם היית על HTTPS – true)
    httpOnly: true,
    sameSite: 'lax'          // ✅ קריטי במצב שאתה עליו (cross-origin)
  }
}));
// 📌 Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));


app.use(express.json());
app.use('/blockedDays', blockedRoutes);

// 📌 Routes
app.use('/customers', customerRoutes);
app.use('/appointments', appointmentRoutes);
app.use('/manager', managerRoutes);

// 📌 ברירת מחדל - מסלול לא קיים
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

module.exports = app;
