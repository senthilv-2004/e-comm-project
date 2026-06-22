// src/pages/HomePage/HomePage.js - Main landing page
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productAPI } from '../../api/axios';
import { getFeaturedProducts, getCategories } from '../../data/products';
import ProductCard from '../../components/ProductCard/ProductCard';
import './HomePage.css';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  // Fetch featured products and categories on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Try static data first
        const staticFeatured = getFeaturedProducts().slice(0, 4);
        const staticCategories = getCategories();
        
        if (staticFeatured.length > 0) {
          setFeaturedProducts(staticFeatured);
          setCategories(staticCategories);
        } else {
          // Fallback to API
          const [productsRes, categoriesRes] = await Promise.all([
            productAPI.getAll({ featured: 'true', limit: 4 }),
            productAPI.getCategories(),
          ]);
          setFeaturedProducts(productsRes.data.products || []);
          setCategories(categoriesRes.data.categories || []);
        }
      } catch (error) {
        console.error('Failed to fetch home data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Category icons mapping
  const categoryIcons = {
    'Electronics': '💻',
    'Clothing': '👕',
    'Home & Garden': '🏠',
    'Books': '📚',
    'Sports': '⚽',
    'Toys': '🧸',
    'Beauty': '💄',
    'Automotive': '🚗',
    'Smartphones': '📱',
    'Wearables': '⌚',
    'Audio': '🎧',
    'Appliances': '🧊',
    'Laptops': '💻',
    'Tablets': '📝',
    'TVs': '📺'
  };

  // Features data
  const features = [
    { icon: '🚀', title: 'Fast Delivery', desc: 'Free shipping on orders over $50. Delivered in 2-5 business days.' },
    { icon: '🔒', title: 'Secure Payment', desc: '100% secure payment. We accept all major credit cards & PayPal.' },
    { icon: '↩️', title: 'Easy Returns', desc: '30-day hassle-free returns. No questions asked.' },
    { icon: '💬', title: '24/7 Support', desc: 'Round-the-clock customer support via chat, email, or phone.' },
  ];

  return (
    <div className="home-page">

      {/* ============ HERO SECTION ============ */}
      <section className="hero">
        <div className="container hero-content">
          {/* Hero Text */}
          <div className="hero-text">
            <div className="hero-badge">
              <span>✨</span> New Arrivals Just Dropped
            </div>

            <h1 className="hero-title">
              Shop the{' '}
              <span className="gradient-text">Future</span>{' '}
              of Retail
            </h1>

            <p className="hero-subtitle">
              Discover thousands of premium products at unbeatable prices.
              From electronics to fashion — everything you need, delivered to your door.
            </p>

            <div className="hero-cta">
              <Link to="/products" className="btn btn-primary btn-lg">
                🛍️ Shop Now
              </Link>
              <Link to="/products?featured=true" className="btn btn-secondary btn-lg">
                ⚡ View Deals
              </Link>
            </div>

            {/* Stats */}
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">10K+</span>
                <span className="stat-label">Products</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">50K+</span>
                <span className="stat-label">Customers</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">4.9★</span>
                <span className="stat-label">Rating</span>
              </div>
            </div>
          </div>

          {/* Hero Visual - Mini Product Preview */}
          <div className="hero-visual">
            <div className="hero-image-card">
              <span className="hero-card-badge">🔥 Hot This Week</span>
              <div className="hero-product-preview">
                {featuredProducts.slice(0, 4).map(product => (
                  <Link to={`/products/${product.id}`} key={product.id} className="preview-item">
                    <img
                      src={(product.images && product.images[0]) || product.image_url || 'https://via.placeholder.com/200'}
                      alt={product.name}
                    />
                    <div className="preview-info">
                      <div className="name">{product.name}</div>
                      <div className="price">${parseFloat(product.price).toFixed(2)}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FEATURES SECTION ============ */}
      <section className="section" style={{ paddingTop: 'var(--space-2xl)' }}>
        <div className="container">
          <div className="features-grid">
            {features.map((feature, idx) => (
              <div className="feature-card" key={idx}>
                <span className="feature-icon">{feature.icon}</span>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-desc">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CATEGORIES SECTION ============ */}
      {categories.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-header">
              <h2>Shop by <span className="gradient-text">Category</span></h2>
              <p>Find exactly what you're looking for in our curated categories</p>
            </div>
            <div className="categories-grid">
              {categories.map((cat) => (
                <Link
                  key={cat.category}
                  to={`/products?category=${encodeURIComponent(cat.category)}`}
                  className="category-card"
                >
                  <div className="category-icon">
                    {categoryIcons[cat.category] || '🛍️'}
                  </div>
                  <div>
                    <div className="category-name">{cat.category}</div>
                    <div className="category-count">{cat.count} products</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============ FEATURED PRODUCTS ============ */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>⚡ <span className="gradient-text">Featured</span> Products</h2>
            <p>Hand-picked premium products our customers love</p>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="spinner" />
              <p>Loading amazing products...</p>
            </div>
          ) : (
            <>
              <div className="products-grid">
                {featuredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              <div style={{ textAlign: 'center', marginTop: 'var(--space-2xl)' }}>
                <Link to="/products" className="btn btn-secondary btn-lg">
                  View All Products →
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ============ CTA BANNER ============ */}
      <section className="section">
        <div className="container">
          <div className="cta-banner">
            <h2>Ready to Start Shopping?</h2>
            <p>Join thousands of satisfied customers and discover premium products at great prices.</p>
            <Link to="/register" className="btn-cta-white">
              🚀 Create Free Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
