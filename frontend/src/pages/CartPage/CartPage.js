// src/pages/CartPage/CartPage.js - Shopping cart page (humanized)
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './CartPage.css';

const CartPage = () => {
  const { cartItems, cartLoading, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleQuantityChange = async (cartId, newQty) => {
    if (newQty < 1) return;
    await updateQuantity(cartId, newQty);
  };

  const handleRemove = async (cartId) => {
    await removeFromCart(cartId);
  };

  const handleClearCart = async () => {
    await clearCart();
    setShowClearConfirm(false);
  };

  const shippingThreshold = 50;
  const totalNum = parseFloat(cartTotal) || 0;
  const shippingCost = totalNum >= shippingThreshold ? 0 : 4.99;
  const shippingProgress = Math.min((totalNum / shippingThreshold) * 100, 100);

  if (cartLoading) return (
    <div className="loading-container" style={{ minHeight: '60vh' }}>
      <div className="spinner" />
      <p>Grabbing your cart, one sec…</p>
    </div>
  );

  return (
    <div className="cart-page">
      <div className="page-header">
        <div className="container">
          <h1>🛒 Your <span className="gradient-text">picks so far</span></h1>
          <p>You've got {cartItems.length} thing{cartItems.length !== 1 ? 's' : ''} in here</p>
        </div>
      </div>

      <div className="container">
        {cartItems.length === 0 ? (
          /* Empty Cart */
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h2>Nothing here yet!</h2>
            <p>Looks like you haven't found your thing yet. Let's change that!</p>
            <Link to="/products" className="btn btn-primary btn-lg">
              🛍️ Go find something great
            </Link>
          </div>
        ) : (
          <div className="cart-layout">
            {/* ---- Cart Items ---- */}
            <div className="cart-items">
              <div className="cart-header">
                <h3>What you've picked</h3>
                {!showClearConfirm ? (
                  <button className="clear-cart-btn" onClick={() => setShowClearConfirm(true)}>
                    Start fresh
                  </button>
                ) : (
                  <div className="clear-confirm">
                    <span>Remove everything?</span>
                    <button className="btn btn-sm btn-danger" onClick={handleClearCart}>Yes, clear it</button>
                    <button className="btn btn-sm btn-secondary" onClick={() => setShowClearConfirm(false)}>Keep it</button>
                  </div>
                )}
              </div>

              {cartItems.map(item => (
                <div key={item.cart_id} className="cart-item">
                  {/* Product Image */}
                  <Link to={`/products/${item.product_id}`} className="cart-item-image-wrap">
                    <img
                      src={item.image_url || 'https://via.placeholder.com/100'}
                      alt={item.name}
                      className="cart-item-image"
                    />
                  </Link>

                  {/* Product Details */}
                  <div className="cart-item-details">
                    <span className="cart-item-category">{item.category}</span>
                    <Link to={`/products/${item.product_id}`} className="cart-item-name">
                      {item.name}
                    </Link>
                    <span className="cart-item-unit-price">
                      ${parseFloat(item.price).toFixed(2)} each
                    </span>
                  </div>

                  {/* Quantity Controls */}
                  <div className="cart-item-qty">
                    <div className="quantity-controls">
                      <button
                        className="qty-btn"
                        onClick={() => handleQuantityChange(item.cart_id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >−</button>
                      <span className="qty-display">{item.quantity}</span>
                      <button
                        className="qty-btn"
                        onClick={() => handleQuantityChange(item.cart_id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                      >+</button>
                    </div>
                  </div>

                  {/* Subtotal */}
                  <div className="cart-item-subtotal">
                    <span className="price">${parseFloat(item.subtotal).toFixed(2)}</span>
                  </div>

                  {/* Remove */}
                  <button
                    className="cart-item-remove"
                    onClick={() => handleRemove(item.cart_id)}
                    aria-label="Remove item"
                    title="Remove this item"
                  >✕</button>
                </div>
              ))}
            </div>

            {/* ---- Order Summary ---- */}
            <div className="order-summary">
              <h3>Here's your total</h3>

              <div className="summary-rows">
                <div className="summary-row">
                  <span>Your items ({cartItems.length})</span>
                  <span>${cartTotal}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <span className="free-shipping">
                    {shippingCost === 0 ? 'Free! 🎁' : '$4.99'}
                  </span>
                </div>

                {/* Free shipping progress bar */}
                {totalNum < shippingThreshold && (
                  <div className="shipping-progress-wrap">
                    <div className="shipping-progress-bar">
                      <div className="shipping-progress-fill" style={{ width: `${shippingProgress}%` }} />
                    </div>
                    <div className="shipping-progress-text">
                      You're just <strong>${(shippingThreshold - totalNum).toFixed(2)}</strong> away from free shipping 🎁
                    </div>
                  </div>
                )}

                <div className="summary-divider" />
                <div className="summary-row total">
                  <span>You'll pay</span>
                  <span>${(totalNum + shippingCost).toFixed(2)}</span>
                </div>
              </div>

              <button
                className="btn btn-primary btn-lg"
                style={{ width: '100%', marginTop: 'var(--space-lg)' }}
                onClick={() => navigate('/checkout')}
              >
                Ready to make it yours →
              </button>

              <Link to="/products" className="continue-shopping">
                ← Keep exploring
              </Link>

              {/* Trust */}
              <div className="summary-trust">
                <span>🔒 Secure checkout</span>
                <span>↩️ Easy returns</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
