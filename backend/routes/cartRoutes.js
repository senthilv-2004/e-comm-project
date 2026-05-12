// routes/cartRoutes.js - Shopping Cart API routes
const express = require('express');
const router = express.Router();
const { 
  getCart, 
  addToCart, 
  updateCartItem, 
  removeFromCart, 
  clearCart 
} = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

// All cart routes require authentication
router.use(protect);

// GET /api/cart - Get user's cart items
router.get('/', getCart);

// POST /api/cart - Add item to cart
router.post('/', addToCart);

// PUT /api/cart/:id - Update cart item quantity
router.put('/:id', updateCartItem);

// DELETE /api/cart - Clear entire cart
router.delete('/', clearCart);

// DELETE /api/cart/:id - Remove specific item from cart
router.delete('/:id', removeFromCart);

module.exports = router;
