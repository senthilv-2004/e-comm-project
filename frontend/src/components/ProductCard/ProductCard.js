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
    if (product.stock === 0) return;

    setAdding(true);
    const result = await addToCart(product.id, 1);
    setAdding(false);

    if (result.success) {
      // Show "Added!" feedback briefly
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  // Generate star rating display
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

    return (
      <span className="stars" aria-label={`Rating: ${rating} out of 5`}>
        {'★'.repeat(fullStars)}
        {hasHalf ? '½' : ''}
        {'☆'.repeat(emptyStars)}
      </span>
    );
  };

  return (
    <div className="product-card">
      {/* Featured Badge */}
      {product.is_featured && (
        <div className="product-badge featured">⚡ Featured</div>
      )}

      {/* Out of Stock Overlay */}
      {product.stock === 0 && (
        <div className="product-badge out-of-stock">Out of Stock</div>
      )}

      {/* Product Image */}
      <Link to={`/products/${product.id}`} className="product-image-wrapper">
        <img
          src={imageError ? 'https://via.placeholder.com/300x300/1a1a2e/6c63ff?text=No+Image' : product.image_url}
          alt={product.name}
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
        {/* Category */}
        <span className="product-category">{product.category}</span>

        {/* Product Name */}
        <h3 className="product-name">
          <Link to={`/products/${product.id}`}>{product.name}</Link>
        </h3>

        {/* Rating & Reviews */}
        <div className="product-rating">
          {renderStars(parseFloat(product.rating) || 0)}
          <span className="rating-value">{parseFloat(product.rating || 0).toFixed(1)}</span>
          <span className="reviews-count">({product.reviews_count || 0})</span>
        </div>

        {/* Price & Stock */}
        <div className="product-footer">
          <div className="product-price">
            <span className="price">${parseFloat(product.price).toFixed(2)}</span>
            {product.stock > 0 && product.stock <= 10 && (
              <span className="low-stock">Only {product.stock} left!</span>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            className={`add-to-cart-btn ${added ? 'added' : ''} ${adding ? 'loading' : ''}`}
            onClick={handleAddToCart}
            disabled={product.stock === 0 || adding}
            aria-label={`Add ${product.name} to cart`}
          >
            {adding ? (
              <span className="spinner spinner-sm" />
            ) : added ? (
              '✓ Added!'
            ) : product.stock === 0 ? (
              'Out of Stock'
            ) : (
              '🛒 Add to Cart'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
