import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle 401 responses globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const login = (email, password) =>
  api.post('/auth/login', { email, password });

// Vendors
export const getVendors = () => api.get('/vendors');
export const createVendor = (data) => api.post('/vendors', data);

// Payouts
export const getPayouts = (params) => api.get('/payouts', { params });
export const getPayoutById = (id) => api.get(`/payouts/${id}`);
export const createPayout = (data) => api.post('/payouts', data);
export const submitPayout = (id) => api.post(`/payouts/${id}/submit`);
export const approvePayout = (id) => api.post(`/payouts/${id}/approve`);
export const rejectPayout = (id, decision_reason) =>
  api.post(`/payouts/${id}/reject`, { decision_reason });

export default api;
