# 🐳 בסיס קליל עם Node
FROM node:18-alpine

# תיקיית עבודה באפליקציה
WORKDIR /app

# 🔁 העתקת קבצי backend (node)
COPY package*.json ./
COPY src ./src
 # COPY .env ./ 
RUN npm install

# 🔧 העתקת קוד פרונטנד ובנייתו
COPY client ./client
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
# ✅ הוספה חשובה כאן:
    COPY client/src ./src
    

RUN npm run build

# 📦 מחזיר לשרת
WORKDIR /app

# 🌀 מוודא שהפרונטנד מה־build יהיה זמין ל־express
# (בהנחה שאתה מגיש אותו מהשרת או נשתמש ב-NGINX בהמשך)

# 📡 מאזין על פורט 5000
EXPOSE 5000

# 🚀 הפעלת השרת
CMD ["node", "src/server.js"]
