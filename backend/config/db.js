// config/db.js - MySQL Database Connection Configuration
const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

// Create a connection pool for better performance
// Pool manages multiple connections and reuses them
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ecommerce_db',
  waitForConnections: true,  // Wait if no connections available
  connectionLimit: 10,        // Max 10 simultaneous connections
  queueLimit: 0,              // Unlimited request queue
  acquireTimeout: 60000,      // 60 seconds to acquire connection
  timeout: 60000,             // 60 seconds query timeout
  reconnect: true             // Auto reconnect on disconnect
});

// Get promise-based pool for async/await usage
const promisePool = pool.promise();

// Test database connection on startup
pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Database connection failed:', err.message);
    console.error('   Please check your MySQL credentials in .env file');
    return;
  }
  console.log('✅ Connected to MySQL database successfully!');
  connection.release(); // Release connection back to pool
});

module.exports = promisePool;
