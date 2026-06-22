// src/api/axios.js - Centralized Axios configuration
import axios from 'axios';
import { getProductById, getAllProducts } from '../data/products';

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
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ========================
// Response Interceptor
// ========================
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ========================
// MOCK API Service Functions (Static Frontend Mode)
// ========================
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const authAPI = {
  register: async (data) => {
    await delay(600);
    const user = {
      id: Date.now(),
      name: data.name,
      email: data.email,
      role: 'user'
    };
    return { data: { success: true, token: 'mock-jwt-token-reg', user } };
  },
  login: async (data) => {
    await delay(600);
    if (data.email && data.password) {
      const user = {
        id: data.email === 'admin@shop.com' ? 1 : 2,
        name: data.email.split('@')[0],
        email: data.email,
        role: data.email === 'admin@shop.com' ? 'admin' : 'user'
      };
      return { data: { success: true, token: 'mock-jwt-token', user } };
    }
    throw { response: { data: { message: 'Invalid email or password' } } };
  },
  googleLogin: async (credential) => {
    await delay(600);
    const user = {
      id: 3,
      name: 'Google User',
      email: 'user@gmail.com',
      role: 'user'
    };
    return { data: { success: true, token: 'mock-jwt-token-google', user } };
  },
  getProfile: async () => {
    await delay(300);
    const user = JSON.parse(localStorage.getItem('user'));
    return { data: { user } };
  },
  updateProfile: async (data) => {
    await delay(600);
    return { data: { success: true } };
  },
};

// Mock Products - use static data
export const productAPI = {
  getAll: async (params) => {
    await delay(400);
    const products = getAllProducts();
    return { data: { products, total: products.length, totalPages: 1 } };
  },
  getOne: async (id) => {
    await delay(300);
    const product = getProductById(id);
    if (product) return { data: { product } };
    throw { response: { data: { message: 'Product not found' } } };
  },
  getCategories: async () => {
    await delay(300);
    const products = getAllProducts();
    const catMap = {};
    products.forEach(p => catMap[p.category] = (catMap[p.category] || 0) + 1);
    const categories = Object.entries(catMap).map(([category, count]) => ({ category, count }));
    return { data: { categories } };
  },
  create: async (data) => {
    await delay(600);
    return { data: { success: true, message: 'Product created' } };
  },
  update: async (id, data) => {
    await delay(600);
    return { data: { success: true, message: 'Product updated' } };
  },
  delete: async (id) => {
    await delay(400);
    return { data: { success: true, message: 'Product deleted' } };
  },
};

// Mock Cart with LocalStorage to persist statically
const getLocalCart = () => JSON.parse(localStorage.getItem('mockCart') || '[]');
const saveLocalCart = (cart) => localStorage.setItem('mockCart', JSON.stringify(cart));

export const cartAPI = {
  getCart: async () => {
    await delay(300);
    return { data: { cartItems: getLocalCart() } };
  },
  addToCart: async (data) => {
    await delay(400);
    let cart = getLocalCart();
    const product = getProductById(data.product_id);
    const existing = cart.find(item => item.product_id === data.product_id);
    
    if (existing) {
      existing.quantity += data.quantity || 1;
    } else {
      cart.push({
        cart_id: Date.now(),
        product_id: data.product_id,
        name: product ? product.name : 'Unknown Product',
        price: product ? product.price : 0,
        image_url: product ? product.images[0] : '',
        quantity: data.quantity || 1,
      });
    }
    saveLocalCart(cart);
    return { data: { success: true } };
  },
  updateItem: async (id, data) => {
    await delay(300);
    let cart = getLocalCart();
    const item = cart.find(i => i.cart_id === id);
    if (item) {
      item.quantity = data.quantity;
      saveLocalCart(cart);
    }
    return { data: { success: true } };
  },
  removeItem: async (id) => {
    await delay(300);
    let cart = getLocalCart().filter(i => i.cart_id !== id);
    saveLocalCart(cart);
    return { data: { success: true } };
  },
  clearCart: async () => {
    await delay(300);
    saveLocalCart([]);
    return { data: { success: true } };
  },
};

// Mock Orders with LocalStorage
const getLocalOrders = () => JSON.parse(localStorage.getItem('mockOrders') || '[]');
const saveLocalOrders = (orders) => localStorage.setItem('mockOrders', JSON.stringify(orders));

export const orderAPI = {
  place: async (data) => { 
    await delay(800); 
    const cart = getLocalCart();
    const orderTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const newOrder = {
      id: Date.now(),
      user_name: data.shippingAddress?.fullName || 'Demo User',
      user_email: 'user@example.com',
      total_amount: orderTotal,
      payment_method: data.paymentMethod || 'Credit Card',
      status: 'pending',
      created_at: new Date().toISOString()
    };
    
    const orders = getLocalOrders();
    orders.push(newOrder);
    saveLocalOrders(orders);
    
    // Clear cart upon order place
    saveLocalCart([]);
    return { data: { success: true, orderId: newOrder.id } }; 
  },
  getMyOrders: async () => { 
    await delay(500); 
    return { data: { orders: getLocalOrders() } }; 
  },
  getOne: async (id) => {
    await delay(300);
    const order = getLocalOrders().find(o => String(o.id) === String(id));
    if (order) return { data: { order } };
    throw { response: { data: { message: 'Order not found' } } };
  },
  getAll: async (params) => {
    await delay(500);
    return { data: { orders: getLocalOrders() } };
  },
  updateStatus: async (id, status) => {
    await delay(400);
    let orders = getLocalOrders();
    const order = orders.find(o => String(o.id) === String(id));
    if (order) {
      order.status = status;
      saveLocalOrders(orders);
    }
    return { data: { success: true } };
  },
};

export const adminAPI = {
  getStats: () => API.get('/admin/stats'),
  getUsers: () => API.get('/auth'),
  deleteUser: (id) => API.delete(`/auth/${id}`),
};

export const contactAPI = {
  sendEmail: async (data) => { await delay(600); return { data: { success: true } }; },
};

export default API;
