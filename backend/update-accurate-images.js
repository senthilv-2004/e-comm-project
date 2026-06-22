// backend/update-accurate-images.js
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const accurateImages = {
  'iPhone 15 Pro': [
    'https://m.media-amazon.com/images/I/81sigpNcppL._SL1500_.jpg',
    'https://m.media-amazon.com/images/I/61sE-x3A4SL._SL1500_.jpg',
    'https://m.media-amazon.com/images/I/81xU-Ue3m-L._SL1500_.jpg',
    'https://m.media-amazon.com/images/I/81zD2gZ9KzL._SL1500_.jpg'
  ],
  'Samsung Galaxy S24': [
    'https://m.media-amazon.com/images/I/71CXhVhpM0L._SL1500_.jpg',
    'https://m.media-amazon.com/images/I/71rIvvf8M-L._SL1500_.jpg',
    'https://m.media-amazon.com/images/I/71PZZpA4d3L._SL1500_.jpg',
    'https://m.media-amazon.com/images/I/81p8zNeyjFL._SL1500_.jpg'
  ],
  'MacBook Air M3': [
    'https://m.media-amazon.com/images/I/71jG+e7roXL._SL1500_.jpg',
    'https://m.media-amazon.com/images/I/71b2B5q+TzL._SL1500_.jpg',
    'https://m.media-amazon.com/images/I/71tQ0w8qFQL._SL1500_.jpg',
    'https://m.media-amazon.com/images/I/81K9i9tN4EL._SL1500_.jpg'
  ],
  'Sony PlayStation 5': [
    'https://m.media-amazon.com/images/I/51051FiD9AQ._SL1000_.jpg',
    'https://m.media-amazon.com/images/I/510R2K3x8FL._SL1000_.jpg',
    'https://m.media-amazon.com/images/I/61+R+k7bLBL._SL1000_.jpg',
    'https://m.media-amazon.com/images/I/51r+T+sT3+L._SL1000_.jpg'
  ],
  'Nintendo Switch OLED': [
    'https://m.media-amazon.com/images/I/61-PblYntsL._SL1500_.jpg',
    'https://m.media-amazon.com/images/I/61K+lqLhZ+L._SL1500_.jpg',
    'https://m.media-amazon.com/images/I/71S-d+H-hGL._SL1500_.jpg',
    'https://m.media-amazon.com/images/I/714Wd5wB9aL._SL1500_.jpg'
  ],
  'Nike Air Max 270': [
    'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/awqb8pe0qig9owk313z6/AIR+MAX+270.png',
    'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/a78b5e20-721d-4de6-9ff5-58da503375ea/AIR+MAX+270.png',
    'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/605db089-a2e6-4dcc-acc8-a400f91f3496/AIR+MAX+270.png',
    'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/18a221f7-e435-43ea-9ef9-cc4d5e219717/AIR+MAX+270.png'
  ],
  'Sony WH-1000XM5': [
    'https://m.media-amazon.com/images/I/51aXvjzcukL._SL1200_.jpg',
    'https://m.media-amazon.com/images/I/51A2r0i84TL._SL1200_.jpg',
    'https://m.media-amazon.com/images/I/61j3pe7GfPL._SL1200_.jpg',
    'https://m.media-amazon.com/images/I/61j3pe7GfPL._SL1200_.jpg'
  ],
  'Haier Refrigerator': [
    'https://m.media-amazon.com/images/I/61H4hO4N5aL._SL1500_.jpg',
    'https://m.media-amazon.com/images/I/71R2HNDOQ5L._SL1500_.jpg',
    'https://m.media-amazon.com/images/I/71hU7K7N-xL._SL1500_.jpg',
    'https://m.media-amazon.com/images/I/61U+i051gLL._SL1500_.jpg'
  ]
};

async function updateAccurateImages() {
  const dbName = process.env.DB_NAME || 'ecommerce_db';
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: dbName
  });

  // First, check if Haier Refrigerator exists. If not, add it.
  const [haierCheck] = await connection.query("SELECT id FROM products WHERE name LIKE '%Haier%'");
  let haierId;
  
  if (haierCheck.length === 0) {
    console.log('Adding Haier Refrigerator...');
    const [result] = await connection.query(
      `INSERT INTO products (name, description, price, category, image_url, stock, rating, reviews_count, is_featured) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'Haier 602L 100% Convertible Side by Side Refrigerator',
        'Expert Inverter Technology, Magic Cooling, Black Steel finish with 602L capacity.',
        999.00,
        'Home & Garden',
        accurateImages['Haier Refrigerator'][0],
        20,
        4.6,
        342,
        1
      ]
    );
    haierId = result.insertId;
    
    // Add variants
    await connection.query(
      `INSERT INTO product_variants (product_id, variant_type, variant_value, price_modifier, stock) VALUES ?`,
      [[
        [haierId, 'Color', 'Black Steel', 0, 10],
        [haierId, 'Color', 'Silver', 0, 10],
        [haierId, 'Capacity', '602L', 0, 20]
      ]]
    );
  } else {
    haierId = haierCheck[0].id;
  }

  // Now, update images for all accurate products
  for (const [name, urls] of Object.entries(accurateImages)) {
    const [rows] = await connection.query("SELECT id FROM products WHERE name LIKE ?", [`%${name}%`]);
    
    if (rows.length > 0) {
      const productId = rows[0].id;
      console.log(`Updating images for ${name} (ID: ${productId})...`);
      
      // Update main product image
      await connection.query("UPDATE products SET image_url = ? WHERE id = ?", [urls[0], productId]);
      
      // Clear old product_images
      await connection.query("DELETE FROM product_images WHERE product_id = ?", [productId]);
      
      // Insert new precise images
      const imagesToInsert = urls.map((url, idx) => [productId, url, idx]);
      await connection.query("INSERT INTO product_images (product_id, image_url, sort_order) VALUES ?", [imagesToInsert]);
    }
  }

  console.log('Successfully updated the database with high-quality, accurate images!');
  await connection.end();
}

updateAccurateImages().catch(console.error);
