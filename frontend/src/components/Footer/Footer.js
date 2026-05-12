// src/components/Footer/Footer.js - Professional site footer
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">

        {/* ---- Newsletter Section ---- */}
        <div className="footer-newsletter">
          <div className="newsletter-text">
            <h3>📬 Stay in the Loop</h3>
            <p>Get exclusive deals and new arrivals straight to your inbox.</p>
          </div>
          {subscribed ? (
            <div style={{ color: 'var(--success)', fontWeight: 600, fontSize: '0.95rem' }}>
              ✅ Thanks for subscribing!
            </div>
          ) : (
            <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
              <input
                type="email"
                className="newsletter-input"
                placeholder="Enter your email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="newsletter-btn">Subscribe</button>
            </form>
          )}
        </div>

        {/* ---- Footer Grid ---- */}
        <div className="footer-grid">

          {/* Brand Column */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <div className="logo-icon">🛍️</div>
              <span className="logo-text">ShopEase</span>
            </Link>
            <p className="footer-tagline">
              Your one-stop premium e-commerce destination. Discover amazing products, exclusive deals, and a seamless shopping experience.
            </p>
            <div className="footer-social">
              <a href="#!" className="social-link" aria-label="Facebook">📘</a>
              <a href="#!" className="social-link" aria-label="Twitter">🐦</a>
              <a href="#!" className="social-link" aria-label="Instagram">📷</a>
              <a href="#!" className="social-link" aria-label="YouTube">▶️</a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4>Shop</h4>
            <div className="footer-links">
              <Link to="/products" className="footer-link">All Products</Link>
              <Link to="/products?category=Electronics" className="footer-link">Electronics</Link>
              <Link to="/products?category=Clothing" className="footer-link">Clothing</Link>
              <Link to="/products?category=Books" className="footer-link">Books</Link>
              <Link to="/products?category=Sports" className="footer-link">Sports</Link>
              <Link to="/products?featured=true" className="footer-link">Featured Items</Link>
            </div>
          </div>

          {/* Account */}
          <div className="footer-col">
            <h4>Account</h4>
            <div className="footer-links">
              <Link to="/login" className="footer-link">Login</Link>
              <Link to="/register" className="footer-link">Create Account</Link>
              <Link to="/cart" className="footer-link">My Cart</Link>
              <Link to="/my-orders" className="footer-link">My Orders</Link>
            </div>
          </div>

          {/* Support */}
          <div className="footer-col">
            <h4>Support</h4>
            <div className="footer-links">
              <a href="#!" className="footer-link">Help Center</a>
              <a href="#!" className="footer-link">Track Order</a>
              <a href="#!" className="footer-link">Return Policy</a>
              <a href="#!" className="footer-link">Privacy Policy</a>
              <a href="#!" className="footer-link">Terms of Service</a>
              <a href="#!" className="footer-link">Contact Us</a>
            </div>
          </div>
        </div>

        {/* ---- Footer Bottom Bar ---- */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            © {currentYear} <span>ShopEase</span>. All rights reserved. Made with ❤️
          </p>
          <div className="footer-badges">
            <span className="footer-badge">🔒 SSL Secured</span>
            <span className="footer-badge">📦 Free Returns</span>
            <span className="footer-badge">⚡ Fast Delivery</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
