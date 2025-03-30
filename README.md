# 🚗 Garage CRM – מערכת ניהול מוסך | גרסה 2025

**Garage CRM** היא מערכת ניהול חכמה ומודרנית למוסכים, הכוללת ניהול לקוחות, תיאום תורים, רישום רכבים, הגבלת ימים ושעות, והרשאות גישה למנהלים.  
המערכת מותאמת לעבודה בסביבה עברית מלאה, כוללת ממשק משתמש אינטואיטיבי ומודולריות בין לקוחות לצוות הניהול.

---

## 🧠 תיאור כללי

המערכת מבוססת על חלוקה ל־Frontend ו־Backend, עם מסד נתונים PostgreSQL ואבטחת Session לכל משתמש.  
לקוחות יכולים להירשם, להתחבר, לתאם תור (על פי חוקים מוגדרים), ולצפות בתורים קודמים.  
מנהלים יכולים להתחבר, לנהל את כל המידע, לחסום תאריכים, להוסיף מנהלים חדשים, ולצפות בדוחות עומסים.

---

## 📁 מבנה הפרויקט

```bash
📦 garage-crm/
├── .env                     # משתני סביבה
├── docker-compose.yml      # קונפיגורציית Docker (אופציונלית)
├── src/                    # Backend (Node.js)
│   ├── server.js           # הרצת השרת
│   ├── app.js              # קונפיגורציה ראשית
│   ├── routes/             # קבצי ניתוב: customers, admin, appointments
│   ├── db/                 # חיבור למסד
│   └── migration.sql       # יצירת טבלאות
├── client/                 # Frontend (React)
│   └── src/
│       ├── pages/          # עמודים: הרשמה, כניסה, דשבורד, ניהול תורים
│       ├── api/            # תקשורת עם ה־API
│       └── components/     # קומפוננטות חוזרות
🔄 תזרים מערכת
✍️ רישום לקוח עם רכב

🔐 התחברות לפי טלפון ולוחית רישוי

📋 תיאום תור לפי חוקיות:

אי אפשר לתאם בשבת

שעות פעילות מ־07:30 עד 14:00

סוג שירות קובע אורך התור

יום עם 8 תורים ➝ נחסם

🛠️ שינוי או ביטול תור (עד 24 שעות מראש)

🕒 תורים קודמים

👤 עדכון פרטים אישיים ורכבים

🧑‍💼 התחברות מנהל + דשבורד עם סטטיסטיקות

📊 גרף עומסים + ניהול ימים חסומים + הוספת מנהלים

💻 טכנולוגיות
Backend: Node.js, Express

Frontend: React, Vite, Bootstrap

DB: PostgreSQL

Session: express-session

אבטחה: bcrypt

גרפים: Chart.js

Dev Tools: Docker, dotenv, nodemon

🚀 הפעלה
bash
Copy
Edit
# Back
cd garage-crm
npm install
npm run dev

# Front
cd client
npm install
npm run dev
📌 API עיקריים
Route	Method	תיאור
/customers/register	POST	רישום לקוח חדש
/customers/login	POST	התחברות לפי טלפון ורכב
/customers/dashboard	GET	מידע אישי + תורים + רכבים
/appointments	POST	תיאום תור
/appointments/:id	DELETE	ביטול תור
/appointments/past	GET	שליפת תורים קודמים
/admin/login	POST	התחברות מנהל
/admin/dashboard	GET	דשבורד מנהל
/admin/add-admin	POST	יצירת מנהל נוסף
/admin/appointments-per-day	GET	גרף עומסים
/blockedDays	CRUD	ניהול ימי חסימה
🔮 Roadmap
✅ ניהול הרשאות מלא

✅ תורים לפי עומסים

✅ תמיכה במנהלים מרובים

✅ אבטחת סיסמאות עם bcrypt

⬜ הודעות מייל/SMS

⬜ JWT במקום session

⬜ בדיקות אוטומטיות

במילים פשוטות?
זה לא רק CRM, זה חלום לכל מוסכניק 😄