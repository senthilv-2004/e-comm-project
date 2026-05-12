// src/pages/ProductDetailPage/ProductDetailPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { productAPI } from '../../api/axios';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [addedMsg, setAddedMsg] = useState('');
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await productAPI.getOne(id);
        setProduct(res.data.product);
      } catch (err) {
        setError('Product not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    setAdding(true);
    const result = await addToCart(product.id, quantity);
    setAdding(false);
    if (result.success) {
      setAddedMsg('✅ Added to cart!');
      setTimeout(() => setAddedMsg(''), 3000);
    } else {
      setAddedMsg(`❌ ${result.message}`);
      setTimeout(() => setAddedMsg(''), 3000);
    }
  };

  const renderStars = (rating) => {
    const full = Math.floor(rating);
    const empty = 5 - full;
    return <span className="stars">{'★'.repeat(full)}{'☆'.repeat(empty)}</span>;
  };

  if (loading) return (
    <div className="loading-container" style={{ minHeight: '60vh' }}>
      <div className="spinner" />
      <p>Loading product...</p>
    </div>
  );

  if (error || !product) return (
    <div className="empty-state" style={{ minHeight: '60vh' }}>
      <div style={{ fontSize: '4rem' }}>😕</div>
      <h3>{error || 'Product not found'}</h3>
      <Link to="/products" className="btn btn-primary" style={{ marginTop: 'var(--space-lg)' }}>
        Back to Products
      </Link>
    </div>
  );

  return (
    <div className="product-detail-page">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/">Home</Link> <span>/</span>
          <Link to="/products">Products</Link> <span>/</span>
          <Link to={`/products?category=${product.category}`}>{product.category}</Link> <span>/</span>
          <span className="current">{product.name}</span>
        </nav>

        <div className="product-detail-grid">
          {/* ---- Image Section ---- */}
          <div className="product-detail-image-wrap">
            <div className="product-detail-image-card">
              {product.is_featured && <div className="detail-badge featured">⚡ Featured</div>}
              <img
                src={imageError ? 'https://via.placeholder.com/600x500/1a1a2e/6c63ff?text=No+Image' : product.image_url}
                alt={product.name}
                className="product-detail-image"
                onError={() => setImageError(true)}
              />
            </div>
          </div>

          {/* ---- Info Section ---- */}
          <div className="product-detail-info">
            <span className="product-category">{product.category}</span>
            <h1 className="product-detail-name">{product.name}</h1>

            {/* Rating */}
            <div className="product-detail-rating">
              {renderStars(parseFloat(product.rating) || 0)}
              <span className="rating-value">{parseFloat(product.rating || 0).toFixed(1)}</span>
              <span className="reviews-count">{product.reviews_count || 0} reviews</span>
            </div>

            {/* Price */}
            <div className="product-detail-price">
              <span className="price" style={{ fontSize: '2.2rem' }}>
                ${parseFloat(product.price).toFixed(2)}
              </span>
              {product.stock > 0 ? (
                <span className="badge badge-success">✓ In Stock ({product.stock} left)</span>
              ) : (
                <span className="badge badge-danger">✕ Out of Stock</span>
              )}
            </div>

            {/* Description */}
            <div className="product-detail-desc">
              <h4>About this product</h4>
              <p>{product.description || 'No description available.'}</p>
            </div>

            <div className="divider" />

            {/* Quantity + Add to Cart */}
            {product.stock > 0 && (
              <div className="product-detail-actions">
                <div className="quantity-section">
                  <label>Quantity:</label>
                  <div className="quantity-controls">
                    <button className="qty-btn" onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
                    <span className="qty-display">{quantity}</span>
                    <button className="qty-btn" onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}>+</button>
                  </div>
                </div>

                <button
                  className="btn btn-primary btn-lg add-cart-big"
                  onClick={handleAddToCart}
                  disabled={adding}
                >
                  {adding ? <><span className="spinner spinner-sm" /> Adding...</> : '🛒 Add to Cart'}
                </button>
              </div>
            )}

            {addedMsg && (
              <div className={`alert ${addedMsg.startsWith('✅') ? 'alert-success' : 'alert-error'}`}>
                {addedMsg}
              </div>
            )}

            {/* Trust Badges */}
            <div className="trust-badges">
              <div className="trust-item">🔒 Secure Checkout</div>
              <div className="trust-item">↩️ 30-Day Returns</div>
              <div className="trust-item">🚀 Fast Delivery</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
