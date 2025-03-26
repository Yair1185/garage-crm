You said:
אני שולח לך את קובץ README של הפרוייקט
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
bash
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
הוא כבר לא מעודכן 
תשפר אותו כולל הסברים מפורטים על הפרוייקט
לפחות 200 מילים 
כולל מבנה הפרוייקט
תזרים 
כל מה שאתה יכול לחשוב עליובשביל שאני אוכל להביא את הקובץ למישהו והוא ידע בדיוק מה צריך לעשות בשביל להביא אותו לכדי סיום



2/2

ChatGPT said:
מעולה יאיר! 👏
הנה גרסה משופרת של קובץ README.md שתעשה רושם מקצועי 🔥 ותעזור לכל מפתח להיכנס לפרויקט בקלות:

md
Copy
Edit
# 🚗 Garage CRM – מערכת ניהול מוסך | גרסה 2025

**Garage CRM** היא מערכת ניהול מותאמת אישית עבור מוסכים, המיועדת לתיאום תורים, ניהול לקוחות ורכבים, ניהול ימי עבודה ותחזוקת מאגר נתונים מקצועי.  
הפרויקט בנוי בטכנולוגיות מודרניות ומופרד ל־Backend ו־Frontend בצורה מלאה, כולל תמיכה ב־Sessions, מסדי נתונים מתקדמים, והתאמה רספונסיבית למובייל.

---

## 🧠 תיאור כללי

מערכת ניהול המוסך מאפשרת ללקוחות להירשם, להוסיף רכב, לתאם תור בהתאם לתקנות (ימי עבודה, זמני טיפול, חסימות וכו’), לנהל תורים קיימים, לצפות בהיסטוריית הטיפולים ולערוך את פרטיהם האישיים.

במקביל, מנהל המוסך מקבל מערכת ניהול ייעודית עם גישה לכל התורים, חסימות יומנים, וניהול כולל.

---

## 🗂️ מבנה הפרויקט

📦 garage-crm/ ├── .env # משתני סביבה (DATABASE_URL) ├── Dockerfile / docker-compose # להרצה מהירה עם Docker ├── README.md # קובץ זה │ ├── src/ # Backend (Node.js / Express) │ ├── server.js # נקודת כניסה לשרת │ ├── app.js # הגדרות האפליקציה (CORS, Session וכו’) │ ├── db/index.js # חיבור למסד PostgreSQL │ ├── migration.sql # יצירת טבלאות במסד │ ├── seedPostgres.js # נתוני דמה (אופציונלי) │ └── routes/ # קובצי ניתוב │ ├── customers.js # לקוחות │ ├── appointments.js # תורים │ ├── blockedDays.js # ימי חסימה │ ├── manager.js # ניהול │ ├── client/ # Frontend (React + Vite) │ └── src/ │ ├── App.jsx # ראוטים ראשיים │ ├── api/ # תקשורת מול ה-API │ ├── pages/ # דפים: התחברות, הרשמה, לוח מחוונים, תיאום תורים │ ├── components/ # קומפוננטות עיצוב ואבטחה │ └── styles/ # קובצי CSS

markdown
Copy
Edit

---

## 🔄 תזרים משתמש

1. **רישום לקוח חדש** → `/register`
2. **התחברות לפי טלפון ולוחית רישוי**
3. **דשבורד אישי** עם שם לקוח וברכת זמן (בוקר/צהריים/ערב טוב)
4. **תיאום תור** – רק אם אין תור פעיל:
   - בחירת רכב, תאריך, שעה, סוג טיפול
   - הגבלות: ימי שבת, ימים חסומים, עומס יומי, שעות פעילות
5. **שינוי או ביטול תור** (עד 24 שעות לפני)
6. **צפייה בהיסטוריית תורים**
7. **ניהול רכבים / עדכון פרטים אישיים**
8. **יציאה מהמערכת**

---

## 🛠 טכנולוגיות

- **Backend**: Node.js, Express.js, PostgreSQL
- **Frontend**: React.js, Vite, Bootstrap 5
- **אבטחה**: express-session, CORS
- **Dev Tools**: Docker, dotenv, nodemon
- **בדיקות**: Jest, Supertest (בהמשך)
- **שפה**: עברית מלאה בכל ממשקי ה־UI

---

## 🚀 איך מפעילים?

### ✅ שרת API
```bash
cd garage-crm
npm install
npm run dev
נגיש ב־http://localhost:5000

✅ לקוח (React)
bash
Copy
Edit
cd garage-crm/client
npm install
npm run dev
נגיש ב־http://localhost:5173

🗃️ הגדרות מסד PostgreSQL
קובץ .env:

bash
Copy
Edit
DATABASE_URL=postgresql://postgres:<password>@localhost:5432/garage_crm
הפעלת מסד:

bash
Copy
Edit
psql -U postgres -d garage_crm -f src/migration.sql
🔌 Endpoints עיקריים
Route	Method	תיאור
/customers/register	POST	רישום לקוח חדש
/customers/login	POST	התחברות לקוח
/customers/dashboard	GET	מידע אישי, רכבים, תורים
/customers/add-vehicle	POST	הוספת רכב חדש
/appointments	GET/POST/DELETE	ניהול תורים
/appointments/past	GET	שליפת תורים קודמים
/blockedDays	GET/POST/DELETE	ימי חסימה
/manager	GET/POST (בעתיד)	פעולות מנהל
🗺️ Roadmap: המשך פיתוח
✅ UI רספונסיבי ונגיש

✅ ניהול תורים לפי כללים עסקיים (סוג שירות, עומסים, שעות)

✅ התממשקות עם session (כולל הגנה על דשבורד)

⬜ שליחת מייל/SMS עם אישור תור

⬜ יצירת מסך ניהול מלא למנהל

⬜ תמיכה ב־JWT במקום session

⬜ Docker Compose לפריסה

⬜ טסטים אוטומטיים לכל ה־API

🤝 תרומה ותחזוקה
אם ברצונך לעזור בפרויקט, תוכל:

לשפר את ה־UI

להוסיף טסטים

לעצב עמוד ניהול מלא

לחבר למערכת תשלומים בעתיד