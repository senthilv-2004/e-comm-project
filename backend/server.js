// server.js - Main entry point for the Express backend server
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
dotenv.config();

// Import database connection
const db = require('./config/db');

// Import routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');


// Initialize Express app
const app = express();

// ========================
// Middleware Configuration
// ========================

// Enable CORS for all origins (allow React frontend to communicate)
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));

// Parse incoming JSON requests
app.use(express.json());

// Parse URL-encoded data
app.use(express.urlencoded({ extended: true }));

// Serve static files (product images) from uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ========================
// API Routes
// ========================

// Health check route
app.get('/', (req, res) => {
  res.json({ 
    message: 'E-Commerce API is running!',
    version: '1.0.0',
    status: 'healthy'
  });
});

// Mount routes with base path
app.use('/api/auth', authRoutes);       // Authentication routes
app.use('/api/products', productRoutes); // Product routes
app.use('/api/cart', cartRoutes);        // Cart routes
app.use('/api/orders', orderRoutes);     // Order routes
app.use('/api/admin', adminRoutes);       // Admin analytics routes


// ========================
// 404 Handler
// ========================
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    message: 'Route not found' 
  });
});

// ========================
// Global Error Handler
// ========================
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).json({ 
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// ========================
// Start Server
// ========================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
  console.log(`💾 Database: ${process.env.DB_NAME}`);
  console.log(`\n✅ API Endpoints:`);
  console.log(`   - Auth:     /api/auth`);
  console.log(`   - Products: /api/products`);
  console.log(`   - Cart:     /api/cart`);
  console.log(`   - Orders:   /api/orders\n`);
});

module.exports = app;
