require('dotenv').config();
const path = require('path');
const app = require('./app');
const PORT = process.env.PORT || 5000;
const express = require('express');
// לפני ה־404
app.use(express.static(path.join(__dirname, '../client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/dist/index.html'));
});
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
