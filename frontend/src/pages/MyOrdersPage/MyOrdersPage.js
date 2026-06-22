// src/pages/MyOrdersPage/MyOrdersPage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderAPI } from '../../api/axios';
import './MyOrdersPage.css';

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    orderAPI.getMyOrders()
      .then(res => setOrders(res.data.orders || []))
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  const statusConfig = {
    pending: { color: 'var(--warning)', icon: '⏳', label: 'Pending' },
    processing: { color: 'var(--info)', icon: '⚙️', label: 'Processing' },
    shipped: { color: 'var(--primary)', icon: '🚚', label: 'Shipped' },
    delivered: { color: 'var(--success)', icon: '✅', label: 'Delivered' },
    cancelled: { color: 'var(--danger)', icon: '❌', label: 'Cancelled' },
  };

  if (loading) return (
    <div className="loading-container" style={{ minHeight: '60vh' }}>
      <div className="spinner" />
      <p>Looking up your orders…</p>
    </div>
  );

  return (
    <div className="orders-page">
      <div className="page-header">
        <div className="container">
          <h1>📦 Your <span className="gradient-text">order history</span></h1>
          <p>You've placed {orders.length} order{orders.length !== 1 ? 's' : ''} with us</p>
        </div>
      </div>

      <div className="container" style={{ padding: 'var(--space-2xl) var(--space-lg)' }}>
        {orders.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: '4rem' }}>📦</div>
            <h3>No orders yet</h3>
            <p>Once you find something you love, your orders will live here.</p>
            <Link to="/products" className="btn btn-primary" style={{ marginTop: 'var(--space-lg)' }}>
              🛍️ Let's go find something
            </Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => {
              const status = statusConfig[order.status] || statusConfig.pending;
              const isExpanded = expandedOrder === order.id;
              return (
                <div key={order.id} className="order-card">
                  {/* Order Header */}
                  <div className="order-card-header" onClick={() => setExpandedOrder(isExpanded ? null : order.id)}>
                    <div className="order-id">
                      <span className="label">Order</span>
                      <span className="value">#ORD-{String(order.id).padStart(5, '0')}</span>
                    </div>
                    <div className="order-date">
                      <span className="label">Placed</span>
                      <span className="value">{new Date(order.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                    </div>
                    <div className="order-total">
                      <span className="label">Titotal</span>
                      <span className="value price price-sm">${parseFloat(order.total_amount).toFixed(2)}</span>
                    </div>
                    <div className="order-status">
                      <span className="status-badge" style={{ color: status.color, background: `${status.color}18`, border: `1px solid ${status.color}` }}>
                        {status.icon} {status.label}
                      </span>
                    </div>
                    <button className="expand-btn">{isExpanded ? '▲' : '▼'}</button>
                  </div>

                  {/* Expanded Order Details */}
                  {isExpanded && (
                    <div className="order-card-body">
                      <div className="order-body-grid">
                        <div>
                          <h4>📦 Items</h4>
                          <div className="order-items-preview">
                            {(order.items || []).map(item => (
                              <div key={item.id} className="order-item-row">
                                <img src={item.image_url || 'https://via.placeholder.com/50'} alt={item.name} />
                                <div className="order-item-detail">
                                  <span className="name">{item.name}</span>
                                  <span className="qty-price">Qty {item.quantity} × ${parseFloat(item.price).toFixed(2)}</span>
                                </div>
                                <span className="item-total">${(item.quantity * parseFloat(item.price)).toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4>🏠 Shipping Address</h4>
                          <p className="shipping-addr">{order.shipping_address}</p>
                          <h4 style={{ marginTop: 'var(--space-md)' }}>💳 Payment</h4>
                          <p style={{ textTransform: 'uppercase', fontWeight: 600, fontSize: '0.9rem' }}>{order.payment_method}</p>
                        </div>
                      </div>
                      <div className="order-card-footer">
                        <Link to={`/order-success/${order.id}`} className="btn btn-secondary btn-sm">
                          See full details
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrdersPage;
