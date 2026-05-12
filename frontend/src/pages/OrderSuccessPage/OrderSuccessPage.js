// src/pages/OrderSuccessPage/OrderSuccessPage.js
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { orderAPI } from '../../api/axios';
import './OrderSuccessPage.css';

const OrderSuccessPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderAPI.getOne(id)
      .then(res => setOrder(res.data.order))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const statusColors = {
    pending: 'var(--warning)',
    processing: 'var(--info)',
    shipped: 'var(--primary)',
    delivered: 'var(--success)',
    cancelled: 'var(--danger)',
  };

  return (
    <div className="success-page">
      <div className="container">
        <div className="success-card">
          {/* Success Animation */}
          <div className="success-animation">
            <div className="success-circle">
              <span className="success-checkmark">✓</span>
            </div>
          </div>

          <h1 className="success-title">Order Placed! 🎉</h1>
          <p className="success-subtitle">
            Thank you for shopping with ShopEase! Your order has been confirmed.
          </p>

          {loading ? (
            <div className="loading-container"><div className="spinner" /></div>
          ) : order ? (
            <div className="order-details">
              <div className="order-meta">
                <div className="meta-item">
                  <span className="meta-label">Order ID</span>
                  <span className="meta-value">#ORD-{String(order.id).padStart(5, '0')}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Status</span>
                  <span className="meta-value" style={{ color: statusColors[order.status] || 'inherit', textTransform: 'capitalize' }}>
                    {order.status}
                  </span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Payment</span>
                  <span className="meta-value" style={{ textTransform: 'uppercase' }}>{order.payment_method}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Total</span>
                  <span className="meta-value price">${parseFloat(order.total_amount).toFixed(2)}</span>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="order-address">
                <h4>📦 Shipping To</h4>
                <p>{order.shipping_address}</p>
              </div>

              {/* Order Items */}
              {order.items && order.items.length > 0 && (
                <div className="order-items-list">
                  <h4>🛍️ Items Ordered</h4>
                  {order.items.map(item => (
                    <div key={item.id} className="success-order-item">
                      <img src={item.image_url || 'https://via.placeholder.com/60'} alt={item.name} />
                      <div className="success-item-info">
                        <span className="success-item-name">{item.name}</span>
                        <span className="success-item-qty">Qty: {item.quantity}</span>
                      </div>
                      <span className="success-item-price">
                        ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : null}

          {/* Steps Timeline */}
          <div className="order-steps">
            <div className="step active"><div className="step-dot" /><span>Order Confirmed</span></div>
            <div className="step-line" />
            <div className="step"><div className="step-dot" /><span>Processing</span></div>
            <div className="step-line" />
            <div className="step"><div className="step-dot" /><span>Shipped</span></div>
            <div className="step-line" />
            <div className="step"><div className="step-dot" /><span>Delivered</span></div>
          </div>

          <div className="success-actions">
            <Link to="/my-orders" className="btn btn-primary btn-lg">📦 Track My Orders</Link>
            <Link to="/products" className="btn btn-secondary btn-lg">🛍️ Continue Shopping</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
