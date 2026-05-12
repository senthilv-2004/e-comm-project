// routes/adminRoutes.js - Admin specific API routes
const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// GET /api/admin/stats - Get dashboard statistics (Admin only)
router.get('/stats', protect, adminOnly, getDashboardStats);

module.exports = router;
