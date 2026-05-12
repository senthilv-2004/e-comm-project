// middleware/authMiddleware.js - JWT Authentication Middleware
const jwt = require('jsonwebtoken');
const db = require('../config/db');

/**
 * protect - Middleware to verify JWT token and protect routes
 * Attaches the authenticated user to req.user
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // Check if Authorization header exists and starts with 'Bearer'
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      // Extract token from "Bearer <token>"
      token = req.headers.authorization.split(' ')[1];
    }

    // If no token found, deny access
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided. Please login first.'
      });
    }

    // Verify the token using our secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user in database using decoded ID
    const [users] = await db.execute(
      'SELECT id, name, email, role, avatar, created_at FROM users WHERE id = ?',
      [decoded.id]
    );

    // Check if user still exists in database
    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'User no longer exists. Please login again.'
      });
    }

    // Attach user data to request object for use in route handlers
    req.user = users[0];
    next(); // Continue to next middleware/route handler

  } catch (error) {
    // Handle specific JWT errors
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. Please login again.'
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired. Please login again.'
      });
    }

    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication error'
    });
  }
};

/**
 * adminOnly - Middleware to restrict access to admin users only
 * Must be used AFTER the protect middleware
 */
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next(); // User is admin, allow access
  } else {
    res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.'
    });
  }
};

module.exports = { protect, adminOnly };
