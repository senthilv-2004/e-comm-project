// src/pages/ProductDetailPage/ProductDetailPage.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { getProductById, getRelatedProducts } from '../../data/products';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [addedMsg, setAddedMsg] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('description');

  // Zoom state
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [showLightbox, setShowLightbox] = useState(false);
  const [lightboxZoom, setLightboxZoom] = useState(1);

  const mainImageRef = useRef(null);
  const relatedRef = useRef(null);

  // Load product from static data
  useEffect(() => {
    setLoading(true);
    const p = getProductById(id);
    if (p) {
      setProduct(p);
      setSelectedColor(p.colorVariants[0]);
      setRelatedProducts(getRelatedProducts(p.id));
      setCurrentImageIndex(0);
      setQuantity(1);
      setIsZoomed(false);
      setZoomLevel(1);
      setShowLightbox(false);
    }
    setLoading(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  // Keyboard handler for lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!showLightbox) return;
      if (e.key === 'Escape') setShowLightbox(false);
      if (e.key === 'ArrowRight') navigateImage(1);
      if (e.key === 'ArrowLeft') navigateImage(-1);
      if (e.key === '+' || e.key === '=') handleLightboxZoom(1);
      if (e.key === '-') handleLightboxZoom(-1);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const navigateImage = useCallback((direction) => {
    if (!product) return;
    const totalImages = product.images.length;
    setCurrentImageIndex(prev => (prev + direction + totalImages) % totalImages);
  }, [product]);

  const handleMouseMove = (e) => {
    if (!mainImageRef.current) return;
    const rect = mainImageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  const handleZoomIn = () => {
    setIsZoomed(true);
    setZoomLevel(prev => Math.min(prev + 0.5, 4));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => {
      const newLevel = Math.max(prev - 0.5, 1);
      if (newLevel === 1) setIsZoomed(false);
      return newLevel;
    });
  };

  const handleZoomReset = () => {
    setZoomLevel(1);
    setIsZoomed(false);
  };

  const handleLightboxZoom = (direction) => {
    setLightboxZoom(prev => {
      if (direction > 0) return Math.min(prev + 0.5, 5);
      return Math.max(prev - 0.5, 0.5);
    });
  };

  const handleColorSelect = (variant) => {
    setSelectedColor(variant);
    // Find the image index matching this variant's image
    const idx = product.images.indexOf(variant.image);
    if (idx >= 0) setCurrentImageIndex(idx);
    else setCurrentImageIndex(0);
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    setAdding(true);
    const result = await addToCart(product.id, quantity);
    setAdding(false);
    if (result.success) {
      setAddedMsg('✅ Added to cart!');
    } else {
      setAddedMsg(`❌ ${result.message || 'Failed to add'}`);
    }
    setTimeout(() => setAddedMsg(''), 3000);
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        stars.push(<span key={i} className="star full">★</span>);
      } else if (i === Math.ceil(rating) && rating % 1 > 0) {
        const percent = Math.round((rating % 1) * 100);
        stars.push(
          <span key={i} className="star partial" style={{ '--fill-percent': `${percent}%` }}>
            <span className="star-bg">★</span>
            <span className="star-fill" style={{ width: `${percent}%` }}>★</span>
          </span>
        );
      } else {
        stars.push(<span key={i} className="star empty">☆</span>);
      }
    }
    return <div className="stars-container">{stars}</div>;
  };

  const getRatingBreakdown = () => {
    if (!product || !product.reviews.length) return [];
    const breakdown = [0, 0, 0, 0, 0];
    product.reviews.forEach(r => { breakdown[r.rating - 1]++; });
    return breakdown.reverse();
  };

  const scrollRelated = (direction) => {
    if (relatedRef.current) {
      relatedRef.current.scrollBy({ left: direction * 300, behavior: 'smooth' });
    }
  };

  const currentImage = product?.images[currentImageIndex] || '';

  if (loading) return (
    <div className="loading-container" style={{ minHeight: '60vh' }}>
      <div className="spinner" />
      <p>Loading product...</p>
    </div>
  );

  if (!product) return (
    <div className="empty-state" style={{ minHeight: '60vh' }}>
      <div style={{ fontSize: '4rem' }}>😕</div>
      <h3>Product not found</h3>
      <Link to="/products" className="btn btn-primary" style={{ marginTop: 'var(--space-lg)' }}>
        Back to Products
      </Link>
    </div>
  );

  const ratingBreakdown = getRatingBreakdown();

  return (
    <div className="product-detail-page">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb" id="product-breadcrumb">
          <Link to="/">Home</Link> <span>/</span>
          <Link to="/products">Products</Link> <span>/</span>
          <Link to={`/products?category=${product.category}`}>{product.category}</Link> <span>/</span>
          <span className="current">{product.name}</span>
        </nav>

        <div className="product-detail-grid">
          {/* ---- Left: Image Gallery with Zoom ---- */}
          <div className="product-gallery-section amazon-style">
            <div className="gallery-thumbnails">
              {product.images.map((img, idx) => (
                <div
                  className={`thumbnail-item ${idx === currentImageIndex ? 'active' : ''}`}
                  key={idx}
                  onMouseEnter={() => setCurrentImageIndex(idx)}
                  onClick={() => setCurrentImageIndex(idx)}
                  id={`thumbnail-${idx}`}
                >
                  <img src={img} alt={`${product.name} view ${idx + 1}`} />
                </div>
              ))}
            </div>
            <div
              className={`gallery-main-image ${isZoomed ? 'zoomed' : ''}`}
              ref={mainImageRef}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => { if (zoomLevel > 1) setIsZoomed(true); }}
              onMouseLeave={() => setIsZoomed(false)}
              onClick={() => setShowLightbox(true)}
              id="main-product-image"
            >
              <img
                src={currentImage}
                alt={`${product.name} - View ${currentImageIndex + 1}`}
                style={isZoomed ? {
                  transform: `scale(${zoomLevel})`,
                  transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                } : {}}
              />
              {/* Zoom Controls */}
              <div className="zoom-controls" onClick={(e) => e.stopPropagation()}>
                <button className="zoom-btn" onClick={handleZoomIn} title="Zoom In" id="zoom-in-btn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35M11 8v6M8 11h6"/></svg>
                </button>
                <button className="zoom-btn" onClick={handleZoomOut} title="Zoom Out" id="zoom-out-btn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35M8 11h6"/></svg>
                </button>
                <button className="zoom-btn" onClick={handleZoomReset} title="Reset Zoom" id="zoom-reset-btn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
                </button>
                <button className="zoom-btn" onClick={() => setShowLightbox(true)} title="Full Screen" id="fullscreen-btn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
                </button>
              </div>
              <div className="zoom-hint">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35M11 8v6M8 11h6"/></svg>
                Click to expand · Hover to magnify
              </div>
            </div>
          </div>

          {/* ---- Right: Info Section ---- */}
          <div className="product-detail-info" id="product-info-section">
            <div className="brand-badge">{product.brand}</div>
            <h1 className="product-detail-name" id="product-name">{product.name}</h1>

            {/* Rating */}
            <div className="product-detail-rating" id="product-rating">
              {renderStars(product.rating)}
              <span className="rating-value">{product.rating.toFixed(1)}</span>
              <span className="reviews-count">({product.reviewCount.toLocaleString()} reviews)</span>
            </div>

            {/* Price */}
            <div className="product-detail-price-wrapper" id="product-price">
              <span className="price-current">${product.price.toFixed(2)}</span>
              {product.discount > 0 && (
                <>
                  <span className="price-original">${product.originalPrice.toFixed(2)}</span>
                  <span className="offer-badge">{product.discount}% OFF</span>
                </>
              )}
            </div>

            {/* Stock */}
            {product.stock > 0 ? (
              <div className="stock-indicator in-stock">
                <span className="stock-dot"></span> In Stock ({product.stock} available)
              </div>
            ) : (
              <div className="stock-indicator out-of-stock">
                <span className="stock-dot"></span> Out of Stock
              </div>
            )}

            {/* Offers */}
            {product.offers && product.offers.length > 0 && (
              <div className="offers-box" id="product-offers">
                <h4>🔥 Active Offers</h4>
                <ul>
                  {product.offers.map((offer, idx) => (
                    <li key={idx}>
                      <span className={`offer-icon offer-${offer.type}`}>
                        {offer.type === 'discount' && '💰'}
                        {offer.type === 'bank' && '🏦'}
                        {offer.type === 'exchange' && '🔄'}
                        {offer.type === 'shipping' && '🚀'}
                        {offer.type === 'bundle' && '🎁'}
                        {offer.type === 'financing' && '💳'}
                        {offer.type === 'install' && '🔧'}
                        {offer.type === 'applecare' && '🛡️'}
                        {offer.type === 'warranty' && '🛡️'}
                      </span>
                      {offer.text}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Color Variants */}
            {product.colorVariants && product.colorVariants.length > 0 && (
              <div className="color-variants-section" id="color-variants">
                <h4>Color: <span className="selected-color-name">{selectedColor?.name}</span></h4>
                <div className="color-swatches">
                  {product.colorVariants.map((variant, idx) => (
                    <button
                      key={idx}
                      className={`color-swatch ${selectedColor?.name === variant.name ? 'active' : ''}`}
                      onClick={() => handleColorSelect(variant)}
                      title={variant.name}
                      id={`color-swatch-${idx}`}
                    >
                      <span className="swatch-color" style={{ background: variant.hex }}></span>
                      <span className="swatch-label">{variant.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="divider" />

            {/* Quantity + Add to Cart */}
            {product.stock > 0 && (
              <div className="product-detail-actions" id="product-actions">
                <div className="quantity-section">
                  <label>Quantity</label>
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
                  id="add-to-cart-btn"
                >
                  {adding ? <><span className="spinner spinner-sm" /> Adding...</> : '🛒 Add to Cart'}
                </button>
              </div>
            )}

            {addedMsg && (
              <div className={`alert ${addedMsg.startsWith('✅') ? 'alert-success' : 'alert-error'}`} style={{ marginTop: '1rem' }}>
                {addedMsg}
              </div>
            )}

            {/* Highlights */}
            <div className="product-highlights" id="product-highlights">
              <h4>Key Highlights</h4>
              <ul>
                {product.highlights.map((h, idx) => (
                  <li key={idx}>
                    <span className="highlight-check">✓</span>
                    {h}
                  </li>
                ))}
              </ul>
            </div>

            {/* Trust Badges */}
            <div className="trust-badges">
              <div className="trust-item">🔒 Secure Checkout</div>
              <div className="trust-item">↩️ 30-Day Returns</div>
              <div className="trust-item">🚀 Fast Delivery</div>
              <div className="trust-item">🛡️ {product.warranty}</div>
            </div>
          </div>
        </div>

        {/* ---- Tabbed Content Section ---- */}
        <div className="product-tabs-section" id="product-tabs">
          <div className="tabs-header">
            <button
              className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
              onClick={() => setActiveTab('description')}
            >
              📋 Description
            </button>
            <button
              className={`tab-btn ${activeTab === 'specifications' ? 'active' : ''}`}
              onClick={() => setActiveTab('specifications')}
            >
              ⚙️ Specifications
            </button>
            <button
              className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              ⭐ Reviews ({product.reviewCount.toLocaleString()})
            </button>
          </div>

          <div className="tab-content">
            {/* Description Tab */}
            {activeTab === 'description' && (
              <div className="tab-pane description-pane" id="tab-description">
                <p className="product-full-description">{product.description}</p>
                <div className="about-highlights-grid">
                  {product.highlights.map((h, idx) => (
                    <div className="about-highlight-card" key={idx}>
                      <span className="about-number">{String(idx + 1).padStart(2, '0')}</span>
                      <p>{h}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Specifications Tab */}
            {activeTab === 'specifications' && (
              <div className="tab-pane specs-pane" id="tab-specifications">
                <table className="specs-table">
                  <tbody>
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <tr key={key}>
                        <th>{key}</th>
                        <td>{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="tab-pane reviews-pane" id="tab-reviews">
                <div className="reviews-overview">
                  <div className="reviews-summary">
                    <div className="summary-score">
                      <span className="big-rating">{product.rating.toFixed(1)}</span>
                      {renderStars(product.rating)}
                      <span className="total-reviews">{product.reviewCount.toLocaleString()} reviews</span>
                    </div>
                    <div className="rating-bars">
                      {ratingBreakdown.map((count, idx) => {
                        const starNum = 5 - idx;
                        const percent = product.reviews.length > 0
                          ? Math.round((count / product.reviews.length) * 100)
                          : 0;
                        return (
                          <div className="rating-bar-row" key={starNum}>
                            <span className="bar-label">{starNum} ★</span>
                            <div className="bar-track">
                              <div className="bar-fill" style={{ width: `${percent}%` }}></div>
                            </div>
                            <span className="bar-count">{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="reviews-list">
                  {product.reviews.map(review => (
                    <div className="review-card" key={review.id} id={`review-${review.id}`}>
                      <div className="review-header">
                        <div className="reviewer-avatar">{review.avatar}</div>
                        <div className="reviewer-info">
                          <span className="reviewer-name">{review.user}</span>
                          <span className="review-date">{new Date(review.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                        <div className="review-rating">
                          {renderStars(review.rating)}
                        </div>
                      </div>
                      <h5 className="review-title">{review.title}</h5>
                      <p className="review-comment">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ---- Related Products ---- */}
        {relatedProducts.length > 0 && (
          <div className="related-products-section" id="related-products">
            <h2 className="related-title">You might also like</h2>
            <div className="related-carousel-container">
              <button className="related-nav prev" onClick={() => scrollRelated(-1)} aria-label="Previous">‹</button>
              <div className="related-scroll" ref={relatedRef}>
                {relatedProducts.map(related => (
                  <Link to={`/products/${related.id}`} key={related.id} className="related-card" id={`related-${related.id}`}>
                    <div className="related-img-wrap">
                      <img src={related.images[0]} alt={related.name} />
                    </div>
                    <div className="related-info">
                      <span className="related-brand">{related.brand}</span>
                      <h4 className="related-name">{related.name}</h4>
                      <div className="related-rating">
                        {renderStars(related.rating)}
                        <span style={{ fontSize: '0.8rem', marginLeft: '4px', color: 'var(--text-muted)' }}>({related.reviewCount})</span>
                      </div>
                      <div className="related-price-row">
                        <span className="price">${related.price.toFixed(2)}</span>
                        {related.discount > 0 && (
                          <span className="related-discount">{related.discount}% OFF</span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <button className="related-nav next" onClick={() => scrollRelated(1)} aria-label="Next">›</button>
            </div>
          </div>
        )}
      </div>

      {/* ---- Lightbox / Full-Screen Image Viewer ---- */}
      {showLightbox && (
        <div className="lightbox-overlay" onClick={() => setShowLightbox(false)} id="lightbox">
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setShowLightbox(false)} title="Close">✕</button>

            <div className="lightbox-nav">
              <button onClick={() => navigateImage(-1)} className="lightbox-arrow lightbox-prev" title="Previous image">‹</button>
              <button onClick={() => navigateImage(1)} className="lightbox-arrow lightbox-next" title="Next image">›</button>
            </div>

            <div className="lightbox-image-wrapper">
              <img
                src={currentImage}
                alt={`${product.name} - Full view`}
                style={{ transform: `scale(${lightboxZoom})` }}
                draggable={false}
              />
            </div>

            <div className="lightbox-controls">
              <button onClick={() => handleLightboxZoom(-1)} title="Zoom Out" disabled={lightboxZoom <= 0.5}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35M8 11h6"/></svg>
              </button>
              <span className="zoom-level-display">{Math.round(lightboxZoom * 100)}%</span>
              <button onClick={() => handleLightboxZoom(1)} title="Zoom In" disabled={lightboxZoom >= 5}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35M11 8v6M8 11h6"/></svg>
              </button>
              <button onClick={() => setLightboxZoom(1)} title="Reset">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
              </button>
            </div>

            <div className="lightbox-thumbnails">
              {product.images.map((img, idx) => (
                <div
                  key={idx}
                  className={`lightbox-thumb ${idx === currentImageIndex ? 'active' : ''}`}
                  onClick={() => { setCurrentImageIndex(idx); setLightboxZoom(1); }}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} />
                </div>
              ))}
            </div>

            <div className="lightbox-counter">
              {currentImageIndex + 1} / {product.images.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;
