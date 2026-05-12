// src/pages/CartPage/CartPage.js - Shopping cart page
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './CartPage.css';

const CartPage = () => {
  const { cartItems, cartLoading, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  const handleQuantityChange = async (cartId, newQty) => {
    if (newQty < 1) return;
    await updateQuantity(cartId, newQty);
  };

  const handleRemove = async (cartId) => {
    await removeFromCart(cartId);
  };

  const handleClearCart = async () => {
    if (window.confirm('Clear all items from cart?')) {
      await clearCart();
    }
  };

  if (cartLoading) return (
    <div className="loading-container" style={{ minHeight: '60vh' }}>
      <div className="spinner" />
      <p>Loading cart...</p>
    </div>
  );

  return (
    <div className="cart-page">
      <div className="page-header">
        <div className="container">
          <h1>🛒 Your <span className="gradient-text">Cart</span></h1>
          <p>{cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart</p>
        </div>
      </div>

      <div className="container">
        {cartItems.length === 0 ? (
          /* Empty Cart */
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added anything yet. Let's fix that!</p>
            <Link to="/products" className="btn btn-primary btn-lg">
              🛍️ Start Shopping
            </Link>
          </div>
        ) : (
          <div className="cart-layout">
            {/* ---- Cart Items ---- */}
            <div className="cart-items">
              <div className="cart-header">
                <h3>Cart Items</h3>
                <button className="clear-cart-btn" onClick={handleClearCart}>
                  🗑️ Clear All
                </button>
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
                  >✕</button>
                </div>
              ))}
            </div>

            {/* ---- Order Summary ---- */}
            <div className="order-summary">
              <h3>Order Summary</h3>

              <div className="summary-rows">
                <div className="summary-row">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span>${cartTotal}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <span className="free-shipping">
                    {parseFloat(cartTotal) >= 50 ? 'FREE' : '$4.99'}
                  </span>
                </div>
                {parseFloat(cartTotal) < 50 && (
                  <div className="free-shipping-note">
                    Add ${(50 - parseFloat(cartTotal)).toFixed(2)} more for free shipping!
                  </div>
                )}
                <div className="summary-divider" />
                <div className="summary-row total">
                  <span>Total</span>
                  <span>${(parseFloat(cartTotal) + (parseFloat(cartTotal) >= 50 ? 0 : 4.99)).toFixed(2)}</span>
                </div>
              </div>

              <button
                className="btn btn-primary btn-lg"
                style={{ width: '100%', marginTop: 'var(--space-lg)' }}
                onClick={() => navigate('/checkout')}
              >
                Proceed to Checkout →
              </button>

              <Link to="/products" className="continue-shopping">
                ← Continue Shopping
              </Link>

              {/* Trust */}
              <div className="summary-trust">
                <span>🔒 Secure Checkout</span>
                <span>↩️ Easy Returns</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
