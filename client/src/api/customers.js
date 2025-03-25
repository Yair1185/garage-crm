// ✅ client/src/api/customers.js
import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000' ,
  withCredentials: true // ✅ חובה לשמירת ה-session
});

export const registerCustomer = (data) => API.post('/customers/register', data);
export const loginCustomer = (data) => API.post('/customers/login', data);
export const fetchDashboard = (cookie) =>
  API.get('/customers/dashboard', { headers: { Cookie: cookie } });
export const addVehicle = (data) => API.post('/customers/add-vehicle', data);
export const logoutCustomer = () => API.get('/customers/logout');