const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

async function fixPasswords() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'ecommerce_db'
  });

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash('admin123', salt);
  
  console.log('New hash for admin123:', hash);

  await connection.query('UPDATE users SET password = ? WHERE email IN (?, ?)', [hash, 'admin@shop.com', 'john@example.com']);
  
  console.log('Passwords for admin@shop.com and john@example.com have been reset to "admin123"');

  await connection.end();
}

fixPasswords().catch(err => {
  console.error('Error fixing passwords:', err.message);
});
