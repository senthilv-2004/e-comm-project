-- ============================================================
-- E-Commerce Database Schema
-- Run this file in MySQL to create all required tables
-- ============================================================

-- Create and use the database
CREATE DATABASE IF NOT EXISTS ecommerce_db;
USE ecommerce_db;

-- ============================================================
-- Table: users
-- Stores registered user accounts
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,                        -- Full name
  email VARCHAR(150) NOT NULL UNIQUE,                -- Email (must be unique)
  password VARCHAR(255) NOT NULL,                    -- Hashed password
  role ENUM('user', 'admin') DEFAULT 'user',         -- User role
  avatar VARCHAR(255) DEFAULT NULL,                  -- Profile picture URL
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,    -- Registration time
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================================
-- Table: products
-- Stores all product information
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,                        -- Product name
  description TEXT,                                  -- Product description
  price DECIMAL(10, 2) NOT NULL,                     -- Price with 2 decimal places
  category VARCHAR(100) NOT NULL,                    -- Product category
  image_url VARCHAR(500) DEFAULT NULL,               -- Product image URL
  stock INT DEFAULT 0,                               -- Available stock
  rating DECIMAL(3, 2) DEFAULT 0.00,                 -- Average rating (0-5)
  reviews_count INT DEFAULT 0,                       -- Number of reviews
  is_featured BOOLEAN DEFAULT FALSE,                 -- Featured on homepage?
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================================
-- Table: cart
-- Stores items added to cart by users
-- ============================================================
CREATE TABLE IF NOT EXISTS cart (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,                              -- Reference to user
  product_id INT NOT NULL,                           -- Reference to product
  quantity INT NOT NULL DEFAULT 1,                   -- How many items
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE KEY unique_cart_item (user_id, product_id)  -- Prevent duplicate cart entries
);

-- ============================================================
-- Table: orders
-- Stores placed orders
-- ============================================================
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,                              -- Reference to user
  total_amount DECIMAL(10, 2) NOT NULL,              -- Order total
  status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
  shipping_address TEXT NOT NULL,                    -- Delivery address
  payment_method VARCHAR(50) DEFAULT 'cod',          -- Payment method
  payment_status ENUM('pending', 'paid', 'failed') DEFAULT 'pending',
  notes TEXT DEFAULT NULL,                           -- Order notes
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================================
-- Table: order_items
-- Stores individual items within each order
-- ============================================================
CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,                             -- Reference to order
  product_id INT NOT NULL,                           -- Reference to product
  quantity INT NOT NULL,                             -- Quantity ordered
  price DECIMAL(10, 2) NOT NULL,                     -- Price at time of order
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- ============================================================
-- Sample Data: Admin User
-- Password: admin123 (hashed with bcrypt)
-- ============================================================
INSERT INTO users (name, email, password, role) VALUES
('Admin User', 'admin@shop.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'admin'),
('John Doe', 'john@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'user');

-- ============================================================
-- Sample Data: Products
-- ============================================================
INSERT INTO products (name, description, price, category, image_url, stock, rating, reviews_count, is_featured) VALUES

-- Electronics
('iPhone 15 Pro', 'The latest iPhone with titanium design, A17 Pro chip, and advanced camera system with 48MP main camera.', 999.99, 'Electronics', 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500', 50, 4.8, 245, TRUE),
('Samsung Galaxy S24', 'Flagship Android phone with high-performance specs, 200MP camera, and all-day battery life.', 849.99, 'Electronics', 'https://images.unsplash.com/photo-1610945264803-c22b62d2a7b3?w=500', 35, 4.7, 189, TRUE),
('MacBook Air M3', 'Thin and light laptop powered by M3 chip, with 18-hour battery and stunning Liquid Retina display.', 1299.99, 'Electronics', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500', 20, 4.9, 312, TRUE),
('Sony WH-1000XM5', 'Industry-leading noise canceling wireless headphones with 30-hour battery and multipoint connection.', 349.99, 'Electronics', 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500', 75, 4.7, 428, FALSE),
('iPad Pro 12.9"', 'Most advanced iPad with M2 chip, Liquid Retina XDR display, and Apple Pencil support.', 1099.99, 'Electronics', 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500', 30, 4.8, 156, FALSE),
('Dell XPS 15', 'Premium Windows laptop with InfinityEdge display, Intel Core i9, and NVIDIA RTX graphics.', 1799.99, 'Electronics', 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=500', 15, 4.6, 98, FALSE),

-- Clothing
('Nike Air Max 270', 'Lifestyle shoe with the largest Air unit ever seen in a heel, providing superior cushioning.', 129.99, 'Clothing', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500', 100, 4.5, 567, TRUE),
('Levi\'s 501 Original Jeans', 'The original blue jean since 1873. Straight fit with button fly and iconic look.', 89.99, 'Clothing', 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500', 150, 4.4, 892, FALSE),
('Adidas Ultraboost 23', 'Running shoe with responsive Boost cushioning and Primeknit upper for ultimate comfort.', 189.99, 'Clothing', 'https://images.unsplash.com/photo-1608231387042-66d1773d3028?w=500', 80, 4.6, 334, FALSE),
('Premium Cotton T-Shirt', 'Soft, breathable 100% organic cotton t-shirt available in multiple colors. Perfect for everyday wear.', 29.99, 'Clothing', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500', 200, 4.3, 1234, FALSE),

-- Home & Garden
('Instant Pot Duo 7-in-1', 'Multi-use programmable pressure cooker, slow cooker, rice cooker, steamer, sauté, yogurt maker, and warmer.', 79.99, 'Home & Garden', 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=500', 60, 4.7, 2341, TRUE),
('Dyson V15 Detect', 'Our most powerful cordless vacuum. Laser Detect technology reveals hidden dust.', 699.99, 'Home & Garden', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500', 25, 4.8, 456, FALSE),
('Philips Hue Starter Kit', 'Smart LED bulbs with millions of colors. Control with app, voice, or schedule automations.', 149.99, 'Home & Garden', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500', 45, 4.5, 678, FALSE),

-- Books
('Atomic Habits', 'An Easy & Proven Way to Build Good Habits & Break Bad Ones by James Clear. #1 New York Times bestseller.', 14.99, 'Books', 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500', 500, 4.9, 8934, TRUE),
('The Psychology of Money', 'Timeless lessons on wealth, greed, and happiness by Morgan Housel. Essential reading for investors.', 12.99, 'Books', 'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=500', 400, 4.8, 5621, FALSE),
('Clean Code', 'A Handbook of Agile Software Craftsmanship by Robert C. Martin. Must-read for every developer.', 39.99, 'Books', 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=500', 200, 4.7, 3456, FALSE),

-- Sports
('Yoga Mat Premium', 'Non-slip, eco-friendly natural rubber yoga mat. Extra thick 6mm for superior joint protection.', 59.99, 'Sports', 'https://images.unsplash.com/photo-1601925228037-0b8e81ce7822?w=500', 120, 4.6, 789, FALSE),
('Resistance Bands Set', 'Set of 5 resistance bands with varying levels. Perfect for home workouts, stretching, and physical therapy.', 24.99, 'Sports', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500', 250, 4.4, 1567, FALSE);

-- ============================================================
-- Verification Queries (optional, run to verify)
-- ============================================================
-- SELECT COUNT(*) as total_products FROM products;
-- SELECT COUNT(*) as total_users FROM users;
-- SELECT * FROM users;
