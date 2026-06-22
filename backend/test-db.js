const mysql = require('mysql2/promise');

(async () => {
  try {
    const c = await mysql.createConnection({host:'127.0.0.1', user:'root', password:''});
    console.log('Connected to MySQL via 127.0.0.1');
    const [rows] = await c.query("SHOW DATABASES LIKE 'ecommerce_db'");
    console.log('ecommerce_db exists:', rows.length > 0);
    if (rows.length === 0) {
      console.log('Database not found. Run: node init-db.js');
    } else {
      await c.query('USE ecommerce_db');
      const [users] = await c.query('SELECT id, name, email, role FROM users');
      console.log('Users in DB:', users);
    }
    await c.end();
  } catch(e) {
    console.log('Error:', e.message);
  }
})();
