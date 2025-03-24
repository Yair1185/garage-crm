# 🚗 Garage CRM - מערכת ניהול מוסך (גרסה 2025)

ניהול לקוחות, רכבים, תורים, וימים חסומים עבור מוסך.

## 📂 מבנה פרויקט
📦 root/
│── .env
│── Dockerfile
│── docker-compose.yml
│── README.md
│── src/ - Node.js Express Backend
│ ├── server.js
│ ├── routes/
│ ├── db/index.js (PostgreSQL)
│ ├── migration.sql
│ ├── seedPostgres.js
│── client/ - React Vite Frontend
│ ├── src/
│ │ ├── index.jsx
│ │ ├── App.jsx
│ │ ├── pages/ (RegisterPage, LoginPage, CustomerDashboard...)
│ │ ├── api/ (axios endpoints)
│ │ ├── components/
│── package.json
│── client/package.json

markdown
Copy
Edit

## 🛠 טכנולוגיות
- PostgreSQL 17
- Node.js / Express
- React.js / Vite / React Router
- Bootstrap 5
- Docker / Docker Compose
- dotenv
- Jest / Supertest

## 🚀 הפעלת הפרויקט

### ✅ שרת API
```bash
cd ./garage-crm
npm install
npm run dev
http://localhost:5000

✅ קליינט React
bash
Copy
Edit
cd ./garage-crm/client
npm install
npm run dev
http://localhost:5173

✅ PostgreSQL (קונפיגורציה)
קובץ .env

bash
Copy
Edit
DATABASE_URL=postgresql://postgres:1185@localhost:5432/garage_crm
pg_hba.conf: trust

פקודת התחברות:

bash
Copy
Edit
psql -h localhost -U postgres -d garage_crm
📌 Endpoints עיקריים
Route	Method	Description
/customers/register	POST	רישום לקוח חדש
/customers/login	POST	התחברות לקוח
/customers/dashboard	GET	דאשבורד לקוח
/customers/add-vehicle	POST	הוספת רכב ללקוח
/appointments	GET/POST	ניהול תורים
/blockedDays	GET/POST/DELETE	ימים חסומים
🗒️ משימות להמשך הפרויקט (Roadmap):
✅ 1. ✅ עיצוב דף הבית - מודרני, רספונסיבי, עם אנימציות.
✅ 2. התאמת מערכת הרשאות - לקוחות / מנהלים.
✅ 3. אבטחת API עם JWT / Session + CORS מוגבל.
✅ 4. יצוא לקובץ PDF של התורים / היסטוריית רכבים.
✅ 5. טסטים נוספים לכל ה-API.
✅ 6. פריסה מלאה עם Docker Compose.
✅ 7. תמיכה במשתמשים מרובים בו זמנית (WebSocket/Socket.io).