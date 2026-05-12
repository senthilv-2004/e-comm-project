// routes/productRoutes.js - Product API routes
const express = require('express');
const router = express.Router();
const { 
  getProducts, 
  getProduct, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  getCategories
} = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// GET /api/products/categories - Get all product categories (public)
router.get('/categories', getCategories);

// GET /api/products - Get all products with filtering (public)
router.get('/', getProducts);

// GET /api/products/:id - Get single product (public)
router.get('/:id', getProduct);

// POST /api/products - Create new product (Admin only)
router.post('/', protect, adminOnly, createProduct);

// PUT /api/products/:id - Update product (Admin only)
router.put('/:id', protect, adminOnly, updateProduct);

// DELETE /api/products/:id - Delete product (Admin only)
router.delete('/:id', protect, adminOnly, deleteProduct);

module.exports = router;
