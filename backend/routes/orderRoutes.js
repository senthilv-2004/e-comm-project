// routes/orderRoutes.js - Order API routes
const express = require('express');
const router = express.Router();
const { 
  placeOrder, 
  getMyOrders, 
  getOrder, 
  getAllOrders, 
  updateOrderStatus 
} = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// All order routes require authentication
router.use(protect);

// POST /api/orders - Place a new order
router.post('/', placeOrder);

// Admin only routes below
// GET /api/orders - Get all orders (Admin)
router.get('/', adminOnly, getAllOrders);

// GET /api/orders/my-orders - Get current user's orders
router.get('/my-orders', getMyOrders);

// GET /api/orders/:id - Get single order details
router.get('/:id', getOrder);

// PUT /api/orders/:id/status - Update order status (Admin)
router.put('/:id/status', adminOnly, updateOrderStatus);

module.exports = router;
