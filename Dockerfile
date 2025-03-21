# ✅ Dockerfile - שורש הפרויקט
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Install backend dependencies
COPY package*.json ./
COPY src ./src
RUN npm install

# Install frontend dependencies and build React
COPY client ./client
WORKDIR /app/client
RUN npm install
RUN npm run build

# Return to backend workdir
WORKDIR /app

# Expose backend port
EXPOSE 5000

# Start the backend server
CMD ["node", "src/server.js"]
