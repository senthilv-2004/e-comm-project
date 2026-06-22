const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

(async () => {
  try {
    const c = await mysql.createConnection({host:'127.0.0.1', user:'root', password:''});
    await c.query('USE ecommerce_db');
    
    // Hash 'admin123'
    const newHash = bcrypt.hashSync('admin123', 10);
    
    // Update all users to have 'admin123' as password
    const [result] = await c.query('UPDATE users SET password = ?', [newHash]);
    
    console.log(`Updated ${result.affectedRows} users with the correct 'admin123' hash.`);
    await c.end();
  } catch(e) {
    console.log('Error:', e.message);
  }
})();
