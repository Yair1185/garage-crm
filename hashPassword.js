// hashPassword.js
const bcrypt = require('bcrypt');

const passwordToHash = 'admin123'; // הסיסמה שאתה רוצה להצפין

bcrypt.hash(passwordToHash, 10).then((hashedPassword) => {
  console.log('סיסמה מוצפנת:', hashedPassword);
});
