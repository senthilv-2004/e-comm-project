// backend/add-all-images-variants.js
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

// Generic fallback images per category
const categoryImages = {
  'Electronics': [
    'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500',
    'https://images.unsplash.com/photo-1550009158-9effb64fda5e?w=500',
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500'
  ],
  'Clothing': [
    'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500',
    'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=500',
    'https://images.unsplash.com/photo-1489987707023-afc8248add63?w=500'
  ],
  'Home & Garden': [
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=500',
    'https://images.unsplash.com/photo-1583847268964-b28ce8f30006?w=500',
    'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=500'
  ],
  'Books': [
    'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=500',
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500',
    'https://images.unsplash.com/photo-1535905557558-afc4877a26fc?w=500'
  ],
  'Sports': [
    'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=500',
    'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=500',
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500'
  ]
};

async function seedData() {
  const dbName = process.env.DB_NAME || 'ecommerce_db';
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: dbName
  });

  console.log('Connected to DB. Fetching products...');

  const [products] = await connection.query('SELECT id, name, category, image_url, stock FROM products');
  
  for (const product of products) {
    // 1. ADD IMAGES
    // Check if product already has images
    const [existingImages] = await connection.query('SELECT id FROM product_images WHERE product_id = ?', [product.id]);
    
    if (existingImages.length === 0) {
      console.log(`Adding images for ${product.name}...`);
      const imagesToInsert = [];
      
      // Main image
      imagesToInsert.push([product.id, product.image_url, 0]);
      
      // Add 2 more category-specific images
      const catImages = categoryImages[product.category] || categoryImages['Electronics'];
      // Just pick random images from the category list
      const randomImg1 = catImages[Math.floor(Math.random() * catImages.length)];
      const randomImg2 = catImages[Math.floor(Math.random() * catImages.length)];
      
      imagesToInsert.push([product.id, randomImg1, 1]);
      imagesToInsert.push([product.id, randomImg2, 2]);

      await connection.query('INSERT INTO product_images (product_id, image_url, sort_order) VALUES ?', [imagesToInsert]);
    }

    // 2. ADD VARIANTS
    const [existingVariants] = await connection.query('SELECT id FROM product_variants WHERE product_id = ?', [product.id]);
    
    if (existingVariants.length === 0) {
      console.log(`Adding variants for ${product.name}...`);
      const variantsToInsert = [];
      const stock = Math.max(product.stock, 20); // ensure we have enough to distribute

      if (product.category === 'Clothing') {
        variantsToInsert.push([product.id, 'Size', 'Medium', 0, Math.floor(stock/3)]);
        variantsToInsert.push([product.id, 'Size', 'Large', 0, Math.floor(stock/3)]);
        variantsToInsert.push([product.id, 'Color', 'Black', 0, Math.floor(stock/2)]);
        variantsToInsert.push([product.id, 'Color', 'Grey', 0, Math.floor(stock/2)]);
      } else if (product.category === 'Electronics') {
        variantsToInsert.push([product.id, 'Color', 'Standard', 0, Math.floor(stock/2)]);
        variantsToInsert.push([product.id, 'Color', 'Pro Black', 10, Math.floor(stock/2)]);
        variantsToInsert.push([product.id, 'Warranty', '1 Year', 0, stock]);
        variantsToInsert.push([product.id, 'Warranty', '2 Years', 49.99, stock]);
      } else if (product.category === 'Books') {
        variantsToInsert.push([product.id, 'Format', 'Paperback', 0, stock]);
        variantsToInsert.push([product.id, 'Format', 'Hardcover', 15.00, Math.floor(stock/2)]);
        variantsToInsert.push([product.id, 'Format', 'Kindle Edition', -5.00, 999]);
      } else if (product.category === 'Sports') {
        variantsToInsert.push([product.id, 'Color', 'Black/Red', 0, Math.floor(stock/2)]);
        variantsToInsert.push([product.id, 'Color', 'Blue/White', 0, Math.floor(stock/2)]);
      } else if (product.category === 'Home & Garden') {
        variantsToInsert.push([product.id, 'Color', 'White', 0, Math.floor(stock/2)]);
        variantsToInsert.push([product.id, 'Color', 'Silver', 20.00, Math.floor(stock/2)]);
      } else {
        // Fallback
        variantsToInsert.push([product.id, 'Option', 'Standard', 0, stock]);
        variantsToInsert.push([product.id, 'Option', 'Premium', 25.00, Math.floor(stock/2)]);
      }

      await connection.query('INSERT INTO product_variants (product_id, variant_type, variant_value, price_modifier, stock) VALUES ?', [variantsToInsert]);
    }
  }

  console.log('Successfully seeded images and variants for all products!');
  await connection.end();
}

seedData().catch(console.error);
