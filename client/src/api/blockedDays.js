// ✅ client/src/api/blockedDays.js
import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000' });

export const getBlockedDays = () => API.get('/blockedDays');
export const blockDate = (data) => API.post('/blockedDays/block', data);
export const unblockDate = (date) => API.delete(`/blockedDays/unblock/${date}`);