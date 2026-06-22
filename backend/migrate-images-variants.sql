-- migrate-images-variants.sql
-- Run this script to add images and variants tables to your existing database

USE ecommerce_db;

-- ============================================================
-- Table: product_images
-- Stores up to 5 images per product
-- ============================================================
CREATE TABLE IF NOT EXISTS product_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  sort_order INT DEFAULT 0,
  alt_text VARCHAR(200),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- ============================================================
-- Table: product_variants
-- Stores product variants (e.g., Size, Color, Storage)
-- ============================================================
CREATE TABLE IF NOT EXISTS product_variants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  variant_type VARCHAR(50) NOT NULL,    -- e.g., 'Size', 'Color', 'Storage'
  variant_value VARCHAR(100) NOT NULL,  -- e.g., 'Large', 'Red', '256GB'
  price_modifier DECIMAL(10, 2) DEFAULT 0.00, -- e.g., +50.00 for 256GB
  stock INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- ============================================================
-- Insert 15+ New Products
-- ============================================================
INSERT INTO products (name, description, price, category, image_url, stock, rating, reviews_count, is_featured) VALUES
('Samsung Odyssey G9', '49-inch curved gaming monitor with 240Hz refresh rate and 1ms response time.', 1399.99, 'Electronics', 'https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?w=500', 15, 4.8, 124, TRUE),
('Sony PlayStation 5', 'Next-gen gaming console with ultra-high speed SSD and ray tracing support.', 499.99, 'Electronics', 'https://images.unsplash.com/photo-1606813907291-d86efa9b90cd?w=500', 30, 4.9, 856, TRUE),
('Nintendo Switch OLED', 'Hybrid gaming console with a vibrant 7-inch OLED screen.', 349.99, 'Electronics', 'https://images.unsplash.com/photo-1617096200347-cb04ae810b1d?w=500', 45, 4.8, 642, FALSE),
('GoPro HERO12 Black', 'Waterproof action camera with 5.3K60 HDR video, 27MP photos, and advanced stabilization.', 399.99, 'Electronics', 'https://images.unsplash.com/photo-1502920514313-52581002a659?w=500', 60, 4.6, 312, FALSE),
('Apple Watch Series 9', 'Smartwatch with advanced health sensors, double tap gesture, and a brighter display.', 399.99, 'Electronics', 'https://images.unsplash.com/photo-1434493789847-2902a52dda8c?w=500', 100, 4.8, 543, TRUE),
('Nike Dri-FIT Hoodie', 'Men''s training hoodie made with sweat-wicking fabric to keep you dry and comfortable.', 55.00, 'Clothing', 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500', 120, 4.5, 230, FALSE),
('Levi''s Denim Jacket', 'Classic trucker jacket, a wardrobe staple that goes with almost everything.', 89.50, 'Clothing', 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=500', 80, 4.7, 450, TRUE),
('North Face Beanie', 'Cozy knit beanie to keep your head warm during cold weather adventures.', 28.00, 'Clothing', 'https://images.unsplash.com/photo-1576871337633-5246a48057e9?w=500', 200, 4.6, 150, FALSE),
('Herman Miller Aeron', 'Ergonomic office chair providing optimal support for long hours of sitting.', 1195.00, 'Home & Garden', 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=500', 10, 4.9, 89, TRUE),
('Nespresso VertuoPlus', 'Coffee and espresso maker by De''Longhi with a 40 oz water tank.', 159.00, 'Home & Garden', 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=500', 40, 4.6, 340, FALSE),
('Le Creuset Dutch Oven', 'Enameled cast iron signature round Dutch oven, 5.5 quart.', 419.95, 'Home & Garden', 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=500', 25, 4.9, 560, TRUE),
('Dune by Frank Herbert', 'The classic science fiction masterpiece, winner of the Hugo and Nebula awards.', 18.00, 'Books', 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500', 150, 4.8, 1200, FALSE),
('1984 by George Orwell', 'A dystopian social science fiction novel and cautionary tale.', 15.00, 'Books', 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500', 180, 4.7, 950, FALSE),
('Spalding Basketball', 'Official NBA size and weight indoor/outdoor basketball.', 39.99, 'Sports', 'https://images.unsplash.com/photo-1519861531473-9200262188bf?w=500', 80, 4.5, 320, FALSE),
('Fitbit Charge 6', 'Advanced fitness and health tracker with built-in GPS and heart rate monitor.', 159.95, 'Sports', 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500', 60, 4.4, 450, FALSE),
('Yeti Rambler 20 oz', 'Stainless steel vacuum insulated tumbler with MagSlider lid.', 35.00, 'Sports', 'https://images.unsplash.com/photo-1614765798993-9c8691f1aab3?w=500', 100, 4.8, 890, TRUE);

-- ============================================================
-- Seed Data for Images and Variants (For existing and new products)
-- ============================================================
-- Assuming iPhone 15 Pro is ID 1
INSERT INTO product_images (product_id, image_url, sort_order) VALUES
(1, 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500', 1),
(1, 'https://images.unsplash.com/photo-1695048132717-b77eeb0eb563?w=500', 2),
(1, 'https://images.unsplash.com/photo-1696423737265-5c12b7a0f3eb?w=500', 3),
(1, 'https://images.unsplash.com/photo-1696446702657-3fb2e38c7f3e?w=500', 4);

INSERT INTO product_variants (product_id, variant_type, variant_value, price_modifier, stock) VALUES
(1, 'Storage', '128GB', 0.00, 20),
(1, 'Storage', '256GB', 100.00, 15),
(1, 'Storage', '512GB', 300.00, 10),
(1, 'Storage', '1TB', 500.00, 5),
(1, 'Color', 'Natural Titanium', 0.00, 25),
(1, 'Color', 'Blue Titanium', 0.00, 25);

-- Example for Nike Air Max 270 (ID 7)
INSERT INTO product_images (product_id, image_url, sort_order) VALUES
(7, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500', 1),
(7, 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500', 2),
(7, 'https://images.unsplash.com/photo-1605340537586-05c1e0eb4bc6?w=500', 3);

INSERT INTO product_variants (product_id, variant_type, variant_value, price_modifier, stock) VALUES
(7, 'Size', 'US 8', 0.00, 20),
(7, 'Size', 'US 9', 0.00, 30),
(7, 'Size', 'US 10', 0.00, 30),
(7, 'Size', 'US 11', 0.00, 20),
(7, 'Color', 'Red/Black', 0.00, 50),
(7, 'Color', 'All Black', 0.00, 50);

-- Example for MacBook Air M3 (ID 3)
INSERT INTO product_images (product_id, image_url, sort_order) VALUES
(3, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500', 1),
(3, 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=500', 2);

INSERT INTO product_variants (product_id, variant_type, variant_value, price_modifier, stock) VALUES
(3, 'Memory', '8GB RAM', 0.00, 10),
(3, 'Memory', '16GB RAM', 200.00, 5),
(3, 'Storage', '256GB SSD', 0.00, 10),
(3, 'Storage', '512GB SSD', 200.00, 5),
(3, 'Color', 'Midnight', 0.00, 10),
(3, 'Color', 'Starlight', 0.00, 10);
