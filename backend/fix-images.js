const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

const CATEGORY_IMAGES = {
  'Electronics': [
    'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80',
    'https://images.unsplash.com/photo-1550009158-9effb64fda70?w=800&q=80',
    'https://images.unsplash.com/photo-1526406915894-7bcd65f60845?w=800&q=80',
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80',
    'https://images.unsplash.com/photo-1588508065123-287b28e0131b?w=800&q=80',
    'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=800&q=80'
  ],
  'Clothing': [
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
    'https://images.unsplash.com/photo-1434389678232-04ce1cecac62?w=800&q=80',
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80',
    'https://images.unsplash.com/photo-1489987707023-af0825dad1cb?w=800&q=80',
    'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80',
    'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&q=80'
  ],
  'Home & Garden': [
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80',
    'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&q=80',
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
    'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&q=80',
    'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80',
    'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800&q=80'
  ],
  'Books': [
    'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80',
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80',
    'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800&q=80',
    'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800&q=80',
    'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800&q=80'
  ],
  'Sports': [
    'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&q=80',
    'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80',
    'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800&q=80',
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
    'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=80'
  ],
  'Beauty': [
    'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80',
    'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&q=80',
    'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=800&q=80',
    'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&q=80',
    'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&q=80'
  ],
  'Toys': [
    'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800&q=80',
    'https://images.unsplash.com/photo-1599623560574-39d485900c95?w=800&q=80',
    'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&q=80',
    'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=800&q=80',
    'https://images.unsplash.com/photo-1558877385-81a1c7e67d72?w=800&q=80'
  ],
  'Automotive': [
    'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80',
    'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800&q=80',
    'https://images.unsplash.com/photo-1503376713451-b0dbac1441b4?w=800&q=80',
    'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80',
    'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&q=80'
  ],
  'Default': [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
    'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80',
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80'
  ]
};

const getRandomImages = (category, count) => {
  const pool = CATEGORY_IMAGES[category] || CATEGORY_IMAGES['Default'];
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

(async () => {
  // 1. UPDATE LIVE DATABASE
  try {
    const c = await mysql.createConnection({
      host: '127.0.0.1',
      user: 'root',
      password: '',
      database: 'ecommerce_db'
    });
    
    console.log('Fetching products from database...');
    const [products] = await c.query('SELECT id, name, category, image_url FROM products');
    
    for (const p of products) {
      // 1 primary image + 5 extra images from the category
      const extraImages = getRandomImages(p.category, 5);
      const productImages = [p.image_url, ...extraImages];
      
      await c.query('UPDATE products SET images = ? WHERE id = ?', [JSON.stringify(productImages), p.id]);
    }
    console.log('Database images successfully updated with category-specific galleries.');
    await c.end();
  } catch (e) {
    console.error('Database update failed:', e);
  }

  // 2. UPDATE EXPANDED CATALOG JSON
  try {
    const catalogPath = path.join(__dirname, '../frontend/src/data/expanded_catalog.json');
    const catalogData = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
    
    let updatedCount = 0;
    for (const p of catalogData) {
      // The current images are like "images/LMP-AUR-001-hero-front.jpg"
      // Since they don't exist, we'll replace them with real Unsplash images
      const extraImages = getRandomImages(p.category || 'Smart Home', 5);
      
      // Keep the main image_url if it's external, otherwise use a default Unsplash
      let mainImg = p.image_url;
      if (!mainImg || mainImg.startsWith('images/')) {
        mainImg = getRandomImages('Electronics', 1)[0];
      }

      p.images = [mainImg, ...extraImages];
      updatedCount++;
    }

    fs.writeFileSync(catalogPath, JSON.stringify(catalogData, null, 2));
    console.log(`Updated ${updatedCount} rich products in expanded_catalog.json with real Unsplash images.`);
  } catch (e) {
    console.error('Catalog update failed:', e);
  }

})();
