// src/components/Navbar/Navbar.js - Top navigation bar component
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const userMenuRef = useRef(null);

  // Add shadow to navbar when user scrolls down
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  }, [location]);

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  // Get user initials for avatar
  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar-inner">

          {/* ---- Logo ---- */}
          <Link to="/" className="navbar-logo">
            <div className="logo-icon">🛍️</div>
            <span className="logo-text">ShopEase</span>
          </Link>

          {/* ---- Search Bar (Desktop) ---- */}
          <div className="navbar-search">
            <form onSubmit={handleSearch}>
              <div className="search-input-wrapper">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Find something you'll love…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search products"
                />
                <button type="submit" className="search-btn">Search</button>
              </div>
            </form>
          </div>

          {/* ---- Right Actions ---- */}
          <div className="navbar-actions">

            {/* Contact Link */}
            <Link to="/contact" className="contact-link" style={{ marginRight: '1rem', color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: '500' }}>
              Contact
            </Link>

            {/* Cart Icon */}
            <Link to="/cart" className="cart-btn" aria-label="Shopping cart">
              <span className="cart-icon-svg">🛒</span>
              <span className="cart-text">Cart</span>
              {cartCount > 0 && (
                <span className="cart-badge">{cartCount > 99 ? '99+' : cartCount}</span>
              )}
            </Link>

            {/* User Menu or Auth Buttons */}
            {isAuthenticated ? (
              <div className={`user-menu ${userMenuOpen ? 'open' : ''}`} ref={userMenuRef}>
                <button
                  className="user-menu-btn"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  aria-haspopup="true"
                  aria-expanded={userMenuOpen}
                >
                  <div className="user-avatar">{getInitials(user?.name)}</div>
                  <span className="user-name-text">{user?.name?.split(' ')[0]}</span>
                  <span className="dropdown-arrow">▼</span>
                </button>

                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <div className="dropdown-menu" role="menu">
                    <div className="dropdown-header">
                      <div className="user-name">{user?.name}</div>
                      <div className="user-email">{user?.email}</div>
                    </div>

                    <Link to="/my-orders" className="dropdown-item" role="menuitem">
                      📦 My orders
                    </Link>

                    {isAdmin && (
                      <Link to="/admin" className="dropdown-item" role="menuitem">
                        🏪 Manage my store
                      </Link>
                    )}

                    <div className="dropdown-divider" />

                    <button
                      className="dropdown-item danger"
                      onClick={handleLogout}
                      role="menuitem"
                    >
                      👋 Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="btn-login">
                  <span>Login</span>
                </Link>
                <Link to="/register" className="btn-register">
                  <span>Sign Up</span>
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </nav>

      {/* ---- Mobile Menu ---- */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        {/* Mobile Search */}
        <div className="mobile-search">
          <form onSubmit={handleSearch}>
            <div className="search-input-wrapper">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                className="search-input"
                placeholder="Find something you'll love…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="search-btn">Go</button>
            </div>
          </form>
        </div>

        {/* Mobile Nav Links */}
        <div className="mobile-nav-links">
          <Link to="/" className="mobile-nav-link">🏠 Home</Link>
          <Link to="/products" className="mobile-nav-link">🛍️ Products</Link>
          <Link to="/contact" className="mobile-nav-link">✉️ Contact Us</Link>
          <Link to="/cart" className="mobile-nav-link">
            🛒 Cart {cartCount > 0 && `(${cartCount})`}
          </Link>
          {isAuthenticated && (
            <Link to="/my-orders" className="mobile-nav-link">📦 My orders</Link>
          )}
          {isAdmin && (
            <Link to="/admin" className="mobile-nav-link">🏪 My store</Link>
          )}
        </div>

        {/* Mobile Auth Buttons */}
        {!isAuthenticated ? (
          <div className="mobile-auth-btns">
            <Link to="/login" className="btn btn-secondary">Login</Link>
            <Link to="/register" className="btn btn-primary">Join us</Link>
          </div>
        ) : (
          <div className="mobile-auth-btns">
            <button className="btn btn-danger" onClick={handleLogout}>
              👋 Sign out
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;
