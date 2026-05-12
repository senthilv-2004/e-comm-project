// src/api/axios.js - Centralized Axios configuration
import axios from 'axios';

// Create an Axios instance with base URL from environment variable
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// ========================
// Request Interceptor
// ========================
// Automatically attach JWT token to every request if user is logged in
API.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    if (token) {
      // Add Authorization header with Bearer token
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ========================
// Response Interceptor
// ========================
// Handle global errors like 401 Unauthorized
API.interceptors.response.use(
  (response) => response, // Pass through successful responses
  (error) => {
    // If token is expired or invalid, log out user
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Only redirect if not already on login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ========================
// API Service Functions
// ========================

// Auth API calls
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getProfile: () => API.get('/auth/profile'),
  updateProfile: (data) => API.put('/auth/profile', data),
};

// Product API calls
export const productAPI = {
  getAll: (params) => API.get('/products', { params }),
  getOne: (id) => API.get(`/products/${id}`),
  getCategories: () => API.get('/products/categories'),
  create: (data) => API.post('/products', data),
  update: (id, data) => API.put(`/products/${id}`, data),
  delete: (id) => API.delete(`/products/${id}`),
};

// Cart API calls
export const cartAPI = {
  getCart: () => API.get('/cart'),
  addToCart: (data) => API.post('/cart', data),
  updateItem: (id, data) => API.put(`/cart/${id}`, data),
  removeItem: (id) => API.delete(`/cart/${id}`),
  clearCart: () => API.delete('/cart'),
};

// Order API calls
export const orderAPI = {
  place: (data) => API.post('/orders', data),
  getMyOrders: () => API.get('/orders/my-orders'),
  getOne: (id) => API.get(`/orders/${id}`),
  getAll: (params) => API.get('/orders', { params }),
  updateStatus: (id, status) => API.put(`/orders/${id}/status`, { status }),
};

// Admin API calls
export const adminAPI = {
  getStats: () => API.get('/admin/stats'),
  getUsers: () => API.get('/auth'),
  deleteUser: (id) => API.delete(`/auth/${id}`),
};

export default API;
