// src/components/ProductCard/ProductCard.js - Reusable product card component
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import './ProductCard.css';

/**
 * ProductCard - Displays a product in a grid/listing view
 * @param {object} product - The product data object
 */
const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Normalize data between static JSON and old API format
  const id = product.id;
  const name = product.name;
  const category = product.category;
  const price = parseFloat(product.price);
  const originalPrice = product.originalPrice ? parseFloat(product.originalPrice) : null;
  const discount = product.discount || 0;
  const stock = product.stock !== undefined ? product.stock : 10;
  const rating = parseFloat(product.rating) || 0;
  const reviewCount = product.reviewCount || product.reviews_count || 0;
  const isFeatured = product.isFeatured || product.is_featured;
  
  // Get main image
  let imageUrl = 'https://via.placeholder.com/300x300/1a1a2e/6c63ff?text=No+Image';
  if (product.images && product.images.length > 0) {
    imageUrl = product.images[0];
  } else if (product.image_url) {
    imageUrl = product.image_url;
  }

  // Handle Add to Cart button click
  const handleAddToCart = async (e) => {
    e.preventDefault(); // Don't navigate to product page
    e.stopPropagation();

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Check if product is out of stock
    if (stock === 0) return;

    setAdding(true);
    const result = await addToCart(id, 1);
    setAdding(false);

    if (result.success) {
      // Show "Added!" feedback briefly
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  // Generate star rating display
  const renderStars = (ratingValue) => {
    const fullStars = Math.floor(ratingValue);
    const hasHalf = ratingValue % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

    return (
      <span className="stars" aria-label={`Rating: ${ratingValue} out of 5`}>
        {'★'.repeat(fullStars)}
        {hasHalf ? '½' : ''}
        {'☆'.repeat(emptyStars)}
      </span>
    );
  };

  return (
    <div className="product-card">
      <div className="product-badges">
        {/* Featured Badge */}
        {isFeatured && (
          <div className="product-badge featured">⚡ Featured</div>
        )}
        
        {/* Discount Badge */}
        {discount > 0 && (
          <div className="product-badge discount">{discount}% OFF</div>
        )}

        {/* Out of Stock Overlay */}
        {stock === 0 && (
          <div className="product-badge out-of-stock">Out of Stock</div>
        )}
      </div>

      {/* Product Image */}
      <Link to={`/products/${id}`} className="product-image-wrapper">
        <img
          src={imageError ? 'https://via.placeholder.com/300x300/1a1a2e/6c63ff?text=No+Image' : imageUrl}
          alt={name}
          className="product-image"
          onError={() => setImageError(true)}
          loading="lazy"
        />
        <div className="product-image-overlay">
          <span className="view-details-btn">View Details →</span>
        </div>
      </Link>

      {/* Product Info */}
      <div className="product-info">
        {/* Category & Colors */}
        <div className="product-meta">
          <span className="product-category">{category}</span>
          {product.colorVariants && product.colorVariants.length > 0 && (
            <div className="product-colors">
              {product.colorVariants.slice(0, 4).map((c, i) => (
                <span key={i} className="color-dot" style={{ backgroundColor: c.hex }} title={c.name}></span>
              ))}
              {product.colorVariants.length > 4 && <span className="color-more">+{product.colorVariants.length - 4}</span>}
            </div>
          )}
        </div>

        {/* Product Name */}
        <h3 className="product-name">
          <Link to={`/products/${id}`}>{name}</Link>
        </h3>

        {/* Rating & Reviews */}
        <div className="product-rating">
          {renderStars(rating)}
          <span className="rating-value">{rating.toFixed(1)}</span>
          <span className="reviews-count">({reviewCount})</span>
        </div>

        {/* Price & Stock */}
        <div className="product-footer">
          <div className="product-price-container">
            <span className="price">${price.toFixed(2)}</span>
            {originalPrice && (
              <span className="original-price">${originalPrice.toFixed(2)}</span>
            )}
            {stock > 0 && stock <= 10 && (
              <span className="low-stock">Only {stock} left!</span>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            className={`add-to-cart-btn ${added ? 'added' : ''} ${adding ? 'loading' : ''}`}
            onClick={handleAddToCart}
            disabled={stock === 0 || adding}
            aria-label={`Add ${name} to cart`}
          >
            {adding ? (
              <span className="spinner spinner-sm" />
            ) : added ? (
              '✓ Added!'
            ) : stock === 0 ? (
              'Out of Stock'
            ) : (
              '🛒 Add'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
