# 🚗 Garage CRM - ניהול מוסך

פרויקט ניהול לקוחות, רכבים ותיאום תורים למוסך.

## 📂 מבנה הפרויקט
client/ - React Frontend
src/ - Node.js Express Backend (מחובר ל-PostgreSQL)
src/db/index.js - חיבור למסד נתונים PostgreSQL
src/routes/ - API RESTful
src/migration.sql - יצירת טבלאות במסד
src/seedPostgres.js - הכנסת נתוני דמו

## 🛠 טכנולוגיות
- PostgreSQL
- Node.js / Express
- React.js / React Router
- Bootstrap

## 🚀 הרצת הפרויקט
### 1️⃣ התקנת חבילות

### 2️⃣ הפעלת PostgreSQL:
- וודא שה-PostgreSQL רץ ב-`localhost:5432` או `5000`

### 3️⃣ הרצת השרת:
פתיחה בכתובת: `http://localhost:5173`

## 📌 REST API עיקרי
| Route | Method | Description |
|------|--------|------------|
| /customers/register | POST | רישום לקוח חדש |
| /appointments | GET/POST | ניהול תורים |
| /blockedDays | GET/POST/DELETE | ניהול ימים חסומים |
| /manager/login | POST | התחברות מנהל |

## 📞 צור קשר
[GitHub](https://github.com/Yair1185/garage-crm)
