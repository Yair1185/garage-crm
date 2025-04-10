// ✅ client/src/api/blockedDays.js
import axios from 'axios';

const API = axios.create({ baseURL: 'https://garage-crm-app.onrender.com' });

export const getBlockedDays = () => API.get('/blockedDays');
export const blockDate = (data) => API.post('/blockedDays/block', data);
export const unblockDate = (date) => API.delete(`/blockedDays/unblock/${date}`);