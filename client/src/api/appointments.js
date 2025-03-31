import axios from 'axios';

const api = axios.create({
  baseURL: 'https://garage-crm-app.onrender.com',
  withCredentials: true
});

export const createAppointment = (data) => api.post('/appointments', data);
export const getMyAppointments = () => api.get('/appointments/my');
export const cancelAppointment = (id) => api.delete(`/appointments/${id}`);
export const getPastAppointments = () => api.get('/appointments/past');
