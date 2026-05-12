const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

async function initDB() {
  const dbName = process.env.DB_NAME || 'ecommerce_db';
  
  // Connect without database first to create it
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true // Crucial for executing schema.sql
  });

  console.log('Connected to MySQL server.');

  await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
  console.log(`Database ${dbName} ensured.`);

  await connection.query(`USE ${dbName}`);

  const schemaPath = path.join(__dirname, 'config', 'schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf8');

  console.log('Executing schema.sql...');
  await connection.query(schema);

  console.log('Database schema and sample data initialized successfully.');
  await connection.end();
}

initDB().catch(err => {
  console.error('Failed to initialize database:');
  console.error(err);
  process.exit(1);
});
