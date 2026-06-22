// backend/add-more-images.js
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

// Generic fallback images per category
const categoryImages = {
  'Electronics': [
    'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500',
    'https://images.unsplash.com/photo-1550009158-9effb64fda5e?w=500',
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500',
    'https://images.unsplash.com/photo-1526406915894-7bcd65f60845?w=500',
    'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500'
  ],
  'Clothing': [
    'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500',
    'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=500',
    'https://images.unsplash.com/photo-1489987707023-afc8248add63?w=500',
    'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500'
  ],
  'Home & Garden': [
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=500',
    'https://images.unsplash.com/photo-1583847268964-b28ce8f30006?w=500',
    'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=500',
    'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=500'
  ],
  'Books': [
    'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=500',
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500',
    'https://images.unsplash.com/photo-1535905557558-afc4877a26fc?w=500',
    'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500'
  ],
  'Sports': [
    'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=500',
    'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=500',
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500',
    'https://images.unsplash.com/photo-1519861531473-9200262188bf?w=500'
  ]
};

async function ensureThreePhotos() {
  const dbName = process.env.DB_NAME || 'ecommerce_db';
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: dbName
  });

  const [products] = await connection.query('SELECT id, name, category, image_url FROM products');
  
  for (const product of products) {
    const [images] = await connection.query('SELECT id FROM product_images WHERE product_id = ?', [product.id]);
    
    // We want a total of 4 images (1 main + 3 extra)
    if (images.length < 4) {
      const needed = 4 - images.length;
      console.log(`Adding ${needed} more images for ${product.name}...`);
      
      const imagesToInsert = [];
      const catImages = categoryImages[product.category] || categoryImages['Electronics'];
      
      for (let i = 0; i < needed; i++) {
        const randomImg = catImages[Math.floor(Math.random() * catImages.length)];
        imagesToInsert.push([product.id, randomImg, images.length + i]);
      }

      await connection.query('INSERT INTO product_images (product_id, image_url, sort_order) VALUES ?', [imagesToInsert]);
    }
  }

  console.log('Successfully ensured every product has 4 photos (1 main + 3 gallery)!');
  await connection.end();
}

ensureThreePhotos().catch(console.error);
