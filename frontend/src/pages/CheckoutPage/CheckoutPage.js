// src/pages/CheckoutPage/CheckoutPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderAPI } from '../../api/axios';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'India',
    paymentMethod: 'cod',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.address || !formData.city || !formData.zip) {
      setError('Please fill in all required address fields.'); return;
    }
    setLoading(true);
    const shippingAddress = `${formData.fullName}, ${formData.address}, ${formData.city}, ${formData.state} ${formData.zip}, ${formData.country}. Phone: ${formData.phone}`;
    try {
      const res = await orderAPI.place({
        shipping_address: shippingAddress,
        payment_method: formData.paymentMethod,
        notes: formData.notes
      });
      navigate(`/order-success/${res.data.order.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const shipping = parseFloat(cartTotal) >= 50 ? 0 : 4.99;
  const total = (parseFloat(cartTotal) + shipping).toFixed(2);

  return (
    <div className="checkout-page">
      <div className="page-header">
        <div className="container">
          <h1>✅ <span className="gradient-text">Checkout</span></h1>
          <p>Almost there! Complete your order below.</p>
        </div>
      </div>

      <div className="container">
        <form onSubmit={handleSubmit} className="checkout-layout">
          {/* ---- Left: Form ---- */}
          <div className="checkout-form-col">
            {error && <div className="alert alert-error">⚠️ {error}</div>}

            {/* Shipping Details */}
            <div className="checkout-section">
              <h3 className="checkout-section-title">📦 Shipping Details</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input name="fullName" type="text" className="form-control"
                    value={formData.fullName} onChange={handleChange} required placeholder="John Doe" />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input name="phone" type="tel" className="form-control"
                    value={formData.phone} onChange={handleChange} placeholder="+91 9876543210" />
                </div>
              </div>
              <div className="form-group">
                <label>Email Address *</label>
                <input name="email" type="email" className="form-control"
                  value={formData.email} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Street Address *</label>
                <input name="address" type="text" className="form-control"
                  value={formData.address} onChange={handleChange} required placeholder="123 Main Street, Apt 4B" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>City *</label>
                  <input name="city" type="text" className="form-control"
                    value={formData.city} onChange={handleChange} required placeholder="Mumbai" />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input name="state" type="text" className="form-control"
                    value={formData.state} onChange={handleChange} placeholder="Maharashtra" />
                </div>
                <div className="form-group">
                  <label>ZIP Code *</label>
                  <input name="zip" type="text" className="form-control"
                    value={formData.zip} onChange={handleChange} required placeholder="400001" />
                </div>
              </div>
              <div className="form-group">
                <label>Country</label>
                <select name="country" className="form-control" value={formData.country} onChange={handleChange}>
                  <option>India</option>
                  <option>United States</option>
                  <option>United Kingdom</option>
                  <option>Canada</option>
                  <option>Australia</option>
                </select>
              </div>
            </div>

            {/* Payment Method */}
            <div className="checkout-section">
              <h3 className="checkout-section-title">💳 Payment Method</h3>
              <div className="payment-options">
                {[
                  { value: 'cod', icon: '💵', label: 'Cash on Delivery', desc: 'Pay when you receive' },
                  { value: 'card', icon: '💳', label: 'Credit / Debit Card', desc: 'Visa, Mastercard, RuPay' },
                  { value: 'upi', icon: '📱', label: 'UPI', desc: 'PhonePe, GPay, Paytm' },
                ].map(opt => (
                  <label key={opt.value} className={`payment-option ${formData.paymentMethod === opt.value ? 'selected' : ''}`}>
                    <input type="radio" name="paymentMethod" value={opt.value}
                      checked={formData.paymentMethod === opt.value} onChange={handleChange} />
                    <span className="payment-icon">{opt.icon}</span>
                    <div>
                      <div className="payment-label">{opt.label}</div>
                      <div className="payment-desc">{opt.desc}</div>
                    </div>
                    {formData.paymentMethod === opt.value && <span className="payment-check">✓</span>}
                  </label>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="checkout-section">
              <h3 className="checkout-section-title">📝 Order Notes (Optional)</h3>
              <textarea name="notes" className="form-control" rows="3"
                value={formData.notes} onChange={handleChange}
                placeholder="Special delivery instructions, gift message, etc." />
            </div>
          </div>

          {/* ---- Right: Summary ---- */}
          <div className="checkout-summary-col">
            <div className="checkout-order-summary">
              <h3>Order Summary</h3>
              <div className="checkout-items">
                {cartItems.map(item => (
                  <div key={item.cart_id} className="checkout-item">
                    <img src={item.image_url || 'https://via.placeholder.com/60'} alt={item.name} />
                    <div className="checkout-item-info">
                      <span className="checkout-item-name">{item.name}</span>
                      <span className="checkout-item-qty">Qty: {item.quantity}</span>
                    </div>
                    <span className="checkout-item-price">${parseFloat(item.subtotal).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="checkout-totals">
                <div className="total-row"><span>Subtotal</span><span>${cartTotal}</span></div>
                <div className="total-row"><span>Shipping</span><span style={{ color: shipping === 0 ? 'var(--success)' : 'inherit' }}>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span></div>
                <div className="total-row grand"><span>Total</span><span className="price">${total}</span></div>
              </div>
              <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
                {loading ? <><span className="spinner spinner-sm" /> Placing Order...</> : `🎉 Place Order · $${total}`}
              </button>
              <p className="checkout-secure">🔒 Your payment info is secure and encrypted</p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
