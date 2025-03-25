import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true
});

export const createAppointment = (data) => api.post('/appointments', data);
export const getMyAppointments = () => api.get('/appointments/my');
export const cancelAppointment = (id) => api.delete(`/appointments/${id}`);
