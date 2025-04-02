require('dotenv').config();
const express = require('express');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const { Pool } = require('pg');
const cors = require('cors');
const customerRoutes = require('./routes/customers');
const appointmentRoutes = require('./routes/appointments');
const adminRoutes = require('./routes/admin');
const db = require('./db'); // מעכשיו PostgreSQL

const blockedRoutes = require('./routes/blockedDays');
const app = express();

const pgPool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

app.use(session({
  store: new pgSession({
    pool: pgPool,
    tableName: 'session'
  }),
  name: 'connect.sid',
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,
    sameSite: 'none',
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24
  }
}));
// 📌 Middleware
const allowedOrigins = [
  
  "https://garage-crm-app.onrender.com"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));


app.use(express.json());
app.use('/blockedDays', blockedRoutes);

// 📌 Routes
app.use('/customers', customerRoutes);
app.use('/appointments', appointmentRoutes);
app.use('/admin', adminRoutes);



module.exports = app;
