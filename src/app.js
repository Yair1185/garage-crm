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
app.use(express.json());

// 📌 Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use('/blockedDays', blockedRoutes);
app.use(session({
  secret: process.env.SESSION_SECRET || "supersecret",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// 📌 Routes
app.use('/customers', customerRoutes);
app.use('/appointments', appointmentRoutes);
app.use('/manager', managerRoutes);

// 📌 ברירת מחדל - מסלול לא קיים
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

module.exports = app;
