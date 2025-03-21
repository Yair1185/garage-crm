// ✅ client/src/api/appointments.js
import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000' });

export const getAppointments = () => API.get('/appointments');
export const createAppointment = (data) => API.post('/appointments', data);