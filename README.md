🚗 Garage CRM - מערכת ניהול מוסך מלאה
ניהול לקוחות, רכבים, תיאום תורים וימים חסומים עבור מוסך. פרויקט Full-Stack כולל React, Node.js ו-PostgreSQL.
📂 מבנה הפרויקט

garage-crm/
├── client/                 # React Frontend (Vite + React Router + Axios + Bootstrap)
│   ├── src/
│   │   ├── pages/          # מסכי לקוח ומנהל
│   │   ├── api/            # קריאות API
│   │   └── App.jsx         # ניתוב וקומפוננטות ראשיות
│   └── vite.config.js
├── src/                    # Node.js Express Backend
│   ├── db/                 # חיבור ל-PostgreSQL
│   ├── routes/             # REST API Routes
│   ├── app.js
│   ├── server.js
│   ├── migration.sql
│   ├── seedPostgres.js
│   └── .env
└── README.md

🛠 טכנולוגיות
- PostgreSQL
- Node.js + Express
- React.js + React Router
- Axios
- Bootstrap 5
- Vite
🚀 הרצת הפרויקט

1️⃣ התקנת תלויות:
cd garage-crm
npm install
cd client
npm install

2️⃣ הפעלת PostgreSQL:
createdb -U postgres garage_crm
psql -U postgres -d garage_crm -f src/migration.sql
node src/seedPostgres.js

3️⃣ הרצת השרת (Backend):
npm run dev

4️⃣ הרצת ה-Frontend (React):
cd client
npm run dev

📌 REST API עיקרי
Endpoint
Method
תיאור
/customers/register
POST
רישום לקוח והוספת רכב
/customers/login
POST
התחברות לקוח
/customers/dashboard
GET
דשבורד לקוח
/appointments
GET/POST
ניהול תורים
/blockedDays
GET
שליפת ימים חסומים
/blockedDays/block
POST
חסימת יום
/blockedDays/unblock/:date
DELETE
ביטול חסימה של תאריך
/manager/login
POST
התחברות מנהל
🌐 Frontend (React) כתובות עיקריות

/               -> HomePage
/register       -> RegisterPage
/login          -> LoginPage
/dashboard      -> CustomerDashboard
/admin          -> AdminDashboard

✅ Features

- תיאום תורים לפי שעות פעילות
- חסימת תאריכים (ללא שבתות)
- ניהול לקוחות ורכבים
- הרשאה למנהל בלבד
- REST API מלא
- ממשק רספונסיבי עם Bootstrap

📞 צור קשר
🔗 GitHub Repository: https://github.com/Yair1185/garage-crm