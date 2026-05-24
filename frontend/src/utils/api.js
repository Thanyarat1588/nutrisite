// src/utils/api.js — Axios instance + helper functions
import axios from 'axios';

const api = axios.create({ baseURL: '/api', withCredentials: true });

// แนบ JWT token อัตโนมัติ
api.interceptors.request.use(config => {
  const token = localStorage.getItem('nutrisite_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ถ้า token หมดอายุ redirect ไปหน้า login
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401 || err.response?.status === 403) {
      localStorage.removeItem('nutrisite_token');
      window.location.href = '/admin/login';
    }
    return Promise.reject(err);
  }
);

// ─── Auth ────────────────────────────────────────────────────
export const login           = (body)  => api.post('/auth/login', body);
export const getMe           = ()      => api.get('/auth/me');
export const changePassword  = (body)  => api.put('/auth/change-password', body);

// ─── Categories ──────────────────────────────────────────────
export const getCategories   = ()      => api.get('/categories');
export const getCategoryById = (id)    => api.get(`/categories/${id}`);
export const createCategory  = (body)  => api.post('/categories', body);
export const updateCategory  = (id, b) => api.put(`/categories/${id}`, b);
export const deleteCategory  = (id)    => api.delete(`/categories/${id}`);

// ─── Foods ───────────────────────────────────────────────────
export const getFoods     = (params) => api.get('/foods', { params });
export const getFoodById  = (id)     => api.get(`/foods/${id}`);
export const createFood   = (fd)     => api.post('/foods', fd);
export const updateFood   = (id, fd) => api.put(`/foods/${id}`, fd);
export const deleteFood   = (id)     => api.delete(`/foods/${id}`);

// ─── Settings ────────────────────────────────────────────────
export const getSettings        = ()   => api.get('/settings');
export const updateSettings     = (fd) => api.put('/settings', fd);
export const deleteHeroImage    = ()   => api.delete('/settings/hero-image');

export default api;
