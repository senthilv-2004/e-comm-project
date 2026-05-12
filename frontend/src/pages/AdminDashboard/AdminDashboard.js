// src/pages/AdminDashboard/AdminDashboard.js - Full admin panel
import React, { useState, useEffect } from 'react';
import { productAPI, orderAPI } from '../../api/axios';
import './AdminDashboard.css';

const EMPTY_FORM = { name: '', description: '', price: '', category: '', image_url: '', stock: '', is_featured: false };

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [search, setSearch] = useState('');

  const categories = ['Electronics', 'Clothing', 'Home & Garden', 'Books', 'Sports', 'Toys', 'Beauty'];

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await productAPI.getAll({ limit: 100 });
      setProducts(res.data.products || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const fetchOrders = async () => {
    try {
      const res = await orderAPI.getAll({ limit: 50 });
      setOrders(res.data.orders || []);
    } catch (err) { console.error(err); }
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    setFormError('');
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.category) {
      setFormError('Name, price, and category are required.'); return;
    }
    setFormLoading(true);
    try {
      if (editingId) {
        await productAPI.update(editingId, formData);
        setFormSuccess('Product updated successfully!');
      } else {
        await productAPI.create(formData);
        setFormSuccess('Product created successfully!');
      }
      await fetchProducts();
      setFormData(EMPTY_FORM);
      setEditingId(null);
      setShowForm(false);
      setTimeout(() => setFormSuccess(''), 3000);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save product.');
    } finally { setFormLoading(false); }
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name, description: product.description || '',
      price: product.price, category: product.category,
      image_url: product.image_url || '', stock: product.stock,
      is_featured: !!product.is_featured
    });
    setEditingId(product.id);
    setShowForm(true);
    setFormError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await productAPI.delete(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) { alert('Failed to delete product.'); }
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await orderAPI.updateStatus(orderId, status);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    } catch (err) { alert('Failed to update order status.'); }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  // Stats
  const totalRevenue = orders.reduce((s, o) => s + parseFloat(o.total_amount || 0), 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  const statusOptions = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  const statusColors = { pending: '#ffa500', processing: '#1e90ff', shipped: '#6c63ff', delivered: '#2ed573', cancelled: '#ff4757' };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div className="container">
          <h1>⚙️ <span className="gradient-text">Admin Dashboard</span></h1>
          <p>Manage your store from one place</p>
        </div>
      </div>

      <div className="container admin-container">
        {/* ---- Stats Row ---- */}
        <div className="admin-stats">
          {[
            { icon: '📦', label: 'Total Products', value: products.length, color: 'var(--primary)' },
            { icon: '🛒', label: 'Total Orders', value: orders.length, color: 'var(--info)' },
            { icon: '⏳', label: 'Pending Orders', value: pendingOrders, color: 'var(--warning)' },
            { icon: '💰', label: 'Total Revenue', value: `$${totalRevenue.toFixed(2)}`, color: 'var(--success)' },
          ].map((stat, i) => (
            <div className="stat-card" key={i} style={{ '--stat-color': stat.color }}>
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-info">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ---- Tabs ---- */}
        <div className="admin-tabs">
          <button className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}>
            📦 Products ({products.length})
          </button>
          <button className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
            🛒 Orders ({orders.length})
          </button>
        </div>

        {/* ============ PRODUCTS TAB ============ */}
        {activeTab === 'products' && (
          <div className="admin-panel">
            {/* Form */}
            {showForm ? (
              <div className="product-form-card">
                <h3>{editingId ? '✏️ Edit Product' : '➕ Add New Product'}</h3>
                {formError && <div className="alert alert-error">⚠️ {formError}</div>}
                {formSuccess && <div className="alert alert-success">✅ {formSuccess}</div>}
                <form onSubmit={handleSaveProduct} className="product-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Product Name *</label>
                      <input name="name" type="text" className="form-control" value={formData.name} onChange={handleFormChange} placeholder="e.g. iPhone 15 Pro" />
                    </div>
                    <div className="form-group">
                      <label>Category *</label>
                      <select name="category" className="form-control" value={formData.category} onChange={handleFormChange}>
                        <option value="">-- Select Category --</option>
                        {categories.map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea name="description" className="form-control" rows="3" value={formData.description} onChange={handleFormChange} placeholder="Product description..." />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Price (USD) *</label>
                      <input name="price" type="number" step="0.01" min="0" className="form-control" value={formData.price} onChange={handleFormChange} placeholder="0.00" />
                    </div>
                    <div className="form-group">
                      <label>Stock Quantity</label>
                      <input name="stock" type="number" min="0" className="form-control" value={formData.stock} onChange={handleFormChange} placeholder="0" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Image URL</label>
                    <input name="image_url" type="url" className="form-control" value={formData.image_url} onChange={handleFormChange} placeholder="https://..." />
                  </div>
                  <div className="form-group">
                    <label className="checkbox-label">
                      <input type="checkbox" name="is_featured" checked={formData.is_featured} onChange={handleFormChange} />
                      <span>⚡ Mark as Featured Product</span>
                    </label>
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="btn btn-primary" disabled={formLoading}>
                      {formLoading ? <><span className="spinner spinner-sm" /> Saving...</> : editingId ? '💾 Update Product' : '➕ Create Product'}
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={() => { setShowForm(false); setEditingId(null); setFormData(EMPTY_FORM); }}>
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="panel-toolbar">
                <input type="text" className="form-control" style={{ maxWidth: '320px' }}
                  placeholder="🔍 Search products..." value={search} onChange={e => setSearch(e.target.value)} />
                <button className="btn btn-primary" onClick={() => { setShowForm(true); setEditingId(null); setFormData(EMPTY_FORM); }}>
                  ➕ Add Product
                </button>
              </div>
            )}

            {/* Products Table */}
            {loading ? <div className="loading-container"><div className="spinner" /></div> : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Image</th><th>Name</th><th>Category</th>
                      <th>Price</th><th>Stock</th><th>Featured</th><th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map(product => (
                      <tr key={product.id}>
                        <td>
                          <img src={product.image_url || 'https://via.placeholder.com/60'} alt={product.name} className="table-product-img" />
                        </td>
                        <td className="product-name-cell">{product.name}</td>
                        <td><span className="table-badge">{product.category}</span></td>
                        <td className="price price-sm">${parseFloat(product.price).toFixed(2)}</td>
                        <td>
                          <span style={{ color: product.stock === 0 ? 'var(--danger)' : product.stock <= 5 ? 'var(--warning)' : 'var(--success)', fontWeight: 700 }}>
                            {product.stock}
                          </span>
                        </td>
                        <td>{product.is_featured ? '⚡ Yes' : '—'}</td>
                        <td>
                          <div className="table-actions">
                            <button className="btn btn-sm btn-secondary" onClick={() => handleEdit(product)}>✏️ Edit</button>
                            <button className="btn btn-sm btn-danger" onClick={() => handleDelete(product.id, product.name)}>🗑️</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredProducts.length === 0 && (
                  <div className="empty-state"><p>No products found.</p></div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ============ ORDERS TAB ============ */}
        {activeTab === 'orders' && (
          <div className="admin-panel">
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th><th>Customer</th><th>Amount</th>
                    <th>Payment</th><th>Date</th><th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id}>
                      <td><strong>#ORD-{String(order.id).padStart(5, '0')}</strong></td>
                      <td>
                        <div>{order.user_name || 'Unknown'}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{order.user_email}</div>
                      </td>
                      <td className="price price-sm">${parseFloat(order.total_amount).toFixed(2)}</td>
                      <td style={{ textTransform: 'uppercase', fontSize: '0.8rem' }}>{order.payment_method}</td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td>
                        <select
                          className="status-select"
                          value={order.status}
                          onChange={e => handleUpdateOrderStatus(order.id, e.target.value)}
                          style={{ color: statusColors[order.status] || 'inherit' }}
                        >
                          {statusOptions.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {orders.length === 0 && <div className="empty-state"><p>No orders yet.</p></div>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
