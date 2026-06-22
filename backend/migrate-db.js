const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

async function runMigration() {
  const dbName = process.env.DB_NAME || 'ecommerce_db';
  
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true
  });

  console.log('Connected to MySQL server.');

  await connection.query(`USE ${dbName}`);

  const schemaPath = path.join(__dirname, 'migrate-images-variants.sql');
  const schema = fs.readFileSync(schemaPath, 'utf8');

  console.log('Executing migrate-images-variants.sql...');
  await connection.query(schema);

  console.log('Database migration completed successfully.');
  await connection.end();
}

runMigration().catch(err => {
  console.error('Failed to run migration:');
  console.error(err);
  process.exit(1);
});
