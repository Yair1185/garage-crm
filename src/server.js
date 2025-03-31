require('dotenv').config();
const path = require('path');
const express = require('express');
const app = require('./app');
const PORT = process.env.PORT || 5000;

// 🧱 משרת את קבצי ה-React שנבנו
app.use(express.static(path.join(__dirname, '../client/dist')));

// 🌐 כל בקשה שאינה API מחזירה את index.html (עבור React Router)
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
