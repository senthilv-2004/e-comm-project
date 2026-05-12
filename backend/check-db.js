const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

async function checkDB() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'ecommerce_db'
  });

  const [rows] = await connection.query('SHOW TABLES');
  console.log('Tables in database:', rows);
  
  if (rows.length > 0) {
    for (let row of rows) {
      const tableName = Object.values(row)[0];
      const [count] = await connection.query(`SELECT COUNT(*) as count FROM ${tableName}`);
      console.log(`Table ${tableName} has ${count[0].count} rows.`);
    }
  }

  await connection.end();
}

checkDB().catch(err => {
  console.error('Error checking DB:', err.message);
});
