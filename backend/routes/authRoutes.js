// routes/authRoutes.js - Authentication API routes
const express = require('express');
const router = express.Router();
const { register, login, getProfile, updateProfile, getUsers, deleteUser } = require('../controllers/authController');
const { googleLogin } = require('../controllers/googleAuthController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// GET /api/auth - Get all users (Admin only)
router.get('/', protect, adminOnly, getUsers);

// DELETE /api/auth/:id - Delete a user (Admin only)
router.delete('/:id', protect, adminOnly, deleteUser);

// POST /api/auth/register - Register a new user
router.post('/register', register);

// POST /api/auth/login - Login with email and password
router.post('/login', login);

// POST /api/auth/google - Login with Google OAuth2
router.post('/google', googleLogin);

// GET /api/auth/profile - Get current user's profile (requires login)
router.get('/profile', protect, getProfile);

// PUT /api/auth/profile - Update current user's profile (requires login)
router.put('/profile', protect, updateProfile);

module.exports = router;
