import axios from 'axios';

const BASE_URL =
  import.meta.env.MODE === 'development'
    ? 'https://garage-crm-app.onrender.com'
    : 'https://garage-crm-app.onrender.com'; // תחליף בכתובת שלך מ־Render

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export default api;
