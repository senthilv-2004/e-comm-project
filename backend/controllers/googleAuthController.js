const { OAuth2Client } = require('google-auth-library');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const crypto = require('crypto');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * generateToken - Creates a JWT token for a user
 * @param {number} id - User ID to encode in token
 * @returns {string} JWT token
 */
const generateToken = (id) => {
  return jwt.sign(
    { id }, // Payload: just the user ID
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' } // Token expires in 7 days
  );
};

/**
 * googleLogin - POST /api/auth/google
 * Authenticates user via Google OAuth2 id_token and returns JWT token
 */
const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: 'Google credential is required'
      });
    }

    // Verify the id_token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    // Check if user already exists
    const [existingUsers] = await db.execute(
      'SELECT * FROM users WHERE email = ?',
      [email.toLowerCase()]
    );

    let user;

    if (existingUsers.length > 0) {
      // User exists, log them in
      user = existingUsers[0];
      
      // Optionally update avatar if they don't have one
      if (!user.avatar && picture) {
        await db.execute('UPDATE users SET avatar = ? WHERE id = ?', [picture, user.id]);
        user.avatar = picture;
      }
    } else {
      // User doesn't exist, create them
      // Since the password column is NOT NULL, we generate a secure random password
      const randomPassword = crypto.randomBytes(16).toString('hex');
      const hashedPassword = await bcrypt.hash(randomPassword, 10);
      
      const [result] = await db.execute(
        'INSERT INTO users (name, email, password, role, avatar) VALUES (?, ?, ?, ?, ?)',
        [name, email.toLowerCase(), hashedPassword, 'user', picture]
      );
      
      const newUserId = result.insertId;
      
      // Fetch the newly created user
      const [newUsers] = await db.execute('SELECT * FROM users WHERE id = ?', [newUserId]);
      user = newUsers[0];
    }

    // Generate our own JWT token
    const token = generateToken(user.id);

    res.status(200).json({
      success: true,
      message: `Welcome, ${user.name}!`,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      }
    });

  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({
      success: false,
      message: 'Google authentication failed. Please try again.'
    });
  }
};

module.exports = { googleLogin };
