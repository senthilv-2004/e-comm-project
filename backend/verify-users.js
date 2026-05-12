const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

async function checkUsers() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'ecommerce_db'
  });

  const [rows] = await connection.query('SELECT id, name, email, role FROM users');
  console.log('Users in database:', rows);

  await connection.end();
}

checkUsers().catch(err => {
  console.error('Error checking users:', err.message);
});
