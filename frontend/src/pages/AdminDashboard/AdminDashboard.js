// src/pages/AdminDashboard/AdminDashboard.js - Full admin panel (humanized)
import React, { useState, useEffect } from 'react';
import { productAPI, orderAPI } from '../../api/axios';
import './AdminDashboard.css';

const EMPTY_FORM = { name: '', description: '', price: '', category: '', image_url: '', stock: '', is_featured: false, images: [''], variants: [] };

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
  const [deletingId, setDeletingId] = useState(null);
  const [deleteError, setDeleteError] = useState('');
  const [toast, setToast] = useState('');

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

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...formData.variants];
    newVariants[index][field] = value;
    setFormData({ ...formData, variants: newVariants });
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.category) {
      setFormError('We need at least a name, price, and category to continue.'); return;
    }
    setFormLoading(true);
    try {
      if (editingId) {
        await productAPI.update(editingId, formData);
        setFormSuccess('All saved! Your changes are live. ✅');
      } else {
        await productAPI.create(formData);
        setFormSuccess('New product added! It\'s in your catalog now. 🎉');
      }
      await fetchProducts();
      setFormData(EMPTY_FORM);
      setEditingId(null);
      setShowForm(false);
      setTimeout(() => setFormSuccess(''), 4000);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Something went sideways — want to try again?');
    } finally { setFormLoading(false); }
  };

  const handleEdit = async (product) => {
    try {
      const res = await productAPI.getOne(product.id);
      const fullProduct = res.data.product;
      setFormData({
        name: fullProduct.name, description: fullProduct.description || '',
        price: fullProduct.price, category: fullProduct.category,
        image_url: fullProduct.image_url || '', stock: fullProduct.stock,
        is_featured: !!fullProduct.is_featured,
        images: fullProduct.images && fullProduct.images.length > 0 ? fullProduct.images.map(img => img.image_url) : [''],
        variants: fullProduct.variants ? fullProduct.variants.map(v => ({...v})) : []
      });
      setEditingId(fullProduct.id);
      setShowForm(true);
      setFormError('');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      showToast('Could not load product details.');
    }
  };

  // Inline delete — no more window.confirm
  const handleDeleteConfirm = async (id) => {
    try {
      await productAPI.delete(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      setDeletingId(null);
      setDeleteError('');
      showToast('Product removed from your catalog.');
    } catch (err) {
      setDeleteError('Couldn\'t remove that one — try again?');
    }
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await orderAPI.updateStatus(orderId, status);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
      showToast(`Order status updated to "${statusLabels[status] || status}"`);
    } catch (err) {
      showToast('Couldn\'t update that order — please try again.');
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
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
  const statusLabels = {
    pending: 'Waiting to be processed',
    processing: 'Getting it ready',
    shipped: 'On its way! 🚚',
    delivered: 'Arrived safely ✅',
    cancelled: 'Cancelled'
  };

  const getStockLabel = (stock) => {
    if (stock === 0) return <span className="stock-label out">Out of stock</span>;
    if (stock <= 5) return <span className="stock-label low">Only {stock} left</span>;
    return <span className="stock-label good">{stock} in stock</span>;
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div className="container">
          <h1>👋 <span className="gradient-text">Welcome back!</span></h1>
          <p>Here's what's happening in your store today.</p>
        </div>
      </div>

      {/* Toast notification */}
      {toast && <div className="admin-toast">{toast}</div>}

      <div className="container admin-container">
        {/* ---- Stats Row ---- */}
        {formSuccess && <div className="alert alert-success">{formSuccess}</div>}

        <div className="admin-stats">
          {[
            { icon: '📦', label: 'Items in Your Store', value: products.length, color: 'var(--primary)' },
            { icon: '🛒', label: 'Orders from Customers', value: orders.length, color: 'var(--info)' },
            { icon: '⏳', label: 'Waiting for Your Attention', value: pendingOrders, color: 'var(--warning)' },
            { icon: '💰', label: 'Revenue Earned', value: `$${totalRevenue.toFixed(2)}`, color: 'var(--success)' },
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
            🧺 Your Products ({products.length})
          </button>
          <button className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
            💌 Customer Orders ({orders.length})
          </button>
        </div>

        {/* ============ PRODUCTS TAB ============ */}
        {activeTab === 'products' && (
          <div className="admin-panel">
            {/* Form */}
            {showForm ? (
              <div className="product-form-card">
                <h3>{editingId ? 'Making changes to this product' : '✨ Let\'s add something new'}</h3>
                {formError && <div className="alert alert-error">🤔 {formError}</div>}
                <form onSubmit={handleSaveProduct} className="product-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>What are you selling?</label>
                      <input name="name" type="text" className="form-control" value={formData.name} onChange={handleFormChange} placeholder="e.g. iPhone 15 Pro" />
                    </div>
                    <div className="form-group">
                      <label>Pick a category</label>
                      <select name="category" className="form-control" value={formData.category} onChange={handleFormChange}>
                        <option value="">Choose a category…</option>
                        {categories.map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Tell shoppers about it</label>
                    <textarea name="description" className="form-control" rows="3" value={formData.description} onChange={handleFormChange} placeholder="What makes this product special?" />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>How much does it cost?</label>
                      <input name="price" type="number" step="0.01" min="0" className="form-control" value={formData.price} onChange={handleFormChange} placeholder="0.00" />
                    </div>
                    <div className="form-group">
                      <label>How many do you have?</label>
                      <input name="stock" type="number" min="0" className="form-control" value={formData.stock} onChange={handleFormChange} placeholder="0" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Main Image URL</label>
                    <input name="image_url" type="url" className="form-control" value={formData.image_url} onChange={handleFormChange} placeholder="https://..." />
                  </div>
                  
                  <div className="form-group">
                    <label>Additional Images (Up to 5)</label>
                    {formData.images && formData.images.map((img, idx) => (
                      <div key={idx} className="image-input-row" style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                        <input type="url" className="form-control" value={img} onChange={e => {
                          const newImages = [...formData.images];
                          newImages[idx] = e.target.value;
                          setFormData({...formData, images: newImages});
                        }} placeholder="Image URL" />
                        {formData.images.length > 1 && (
                          <button type="button" className="btn btn-sm btn-danger" onClick={() => {
                            const newImages = formData.images.filter((_, i) => i !== idx);
                            setFormData({...formData, images: newImages});
                          }}>X</button>
                        )}
                      </div>
                    ))}
                    {(!formData.images || formData.images.length < 5) && (
                      <button type="button" className="btn btn-sm btn-secondary" onClick={() => setFormData({...formData, images: [...(formData.images || []), '']})}>
                        + Add Image
                      </button>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Product Variants</label>
                    {formData.variants && formData.variants.length > 0 && (
                      <table className="admin-table variants-table" style={{ marginBottom: '8px' }}>
                        <thead>
                          <tr><th>Type</th><th>Value</th><th>Price Mod ($)</th><th>Stock</th><th></th></tr>
                        </thead>
                        <tbody>
                          {formData.variants.map((v, idx) => (
                            <tr key={idx}>
                              <td><input type="text" className="form-control" value={v.variant_type} onChange={e => handleVariantChange(idx, 'variant_type', e.target.value)} placeholder="e.g. Size" /></td>
                              <td><input type="text" className="form-control" value={v.variant_value} onChange={e => handleVariantChange(idx, 'variant_value', e.target.value)} placeholder="e.g. Large" /></td>
                              <td><input type="number" step="0.01" className="form-control" value={v.price_modifier} onChange={e => handleVariantChange(idx, 'price_modifier', e.target.value)} /></td>
                              <td><input type="number" className="form-control" value={v.stock} onChange={e => handleVariantChange(idx, 'stock', e.target.value)} /></td>
                              <td><button type="button" className="btn btn-sm btn-danger" onClick={() => {
                                const newV = formData.variants.filter((_, i) => i !== idx);
                                setFormData({...formData, variants: newV});
                              }}>X</button></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                    <button type="button" className="btn btn-sm btn-secondary" onClick={() => setFormData({...formData, variants: [...(formData.variants || []), {variant_type: '', variant_value: '', price_modifier: 0, stock: 0}]})}>
                      + Add Variant
                    </button>
                  </div>
                  <div className="form-group">
                    <label className="checkbox-label">
                      <input type="checkbox" name="is_featured" checked={formData.is_featured} onChange={handleFormChange} />
                      <span>⭐ Feature this on the homepage</span>
                    </label>
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="btn btn-primary" disabled={formLoading}>
                      {formLoading ? <><span className="spinner spinner-sm" /> Just a moment…</> : editingId ? 'Save changes' : 'Save to catalog ✨'}
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={() => { setShowForm(false); setEditingId(null); setFormData(EMPTY_FORM); }}>
                      Never mind
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="panel-toolbar">
                <input type="text" className="form-control" style={{ maxWidth: '320px' }}
                  placeholder="🔍 Find a product…" value={search} onChange={e => setSearch(e.target.value)} />
                <button className="btn btn-primary" onClick={() => { setShowForm(true); setEditingId(null); setFormData(EMPTY_FORM); }}>
                  + Add something new
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
                      <React.Fragment key={product.id}>
                        <tr className={deletingId === product.id ? 'row-deleting' : ''}>
                          <td>
                            <img src={product.image_url || 'https://via.placeholder.com/60'} alt={product.name} className="table-product-img" />
                          </td>
                          <td className="product-name-cell">{product.name}</td>
                          <td><span className="table-badge">{product.category}</span></td>
                          <td className="price price-sm">${parseFloat(product.price).toFixed(2)}</td>
                          <td>{getStockLabel(product.stock)}</td>
                          <td>{product.is_featured ? '⭐ Yes' : '—'}</td>
                          <td>
                            <div className="table-actions">
                              <button className="btn btn-sm btn-secondary" onClick={() => handleEdit(product)}>✏️ Edit</button>
                              <button className="btn btn-sm btn-danger" onClick={() => { setDeletingId(product.id); setDeleteError(''); }}>🗑️</button>
                            </div>
                          </td>
                        </tr>
                        {/* Inline delete confirmation */}
                        {deletingId === product.id && (
                          <tr className="delete-confirm-row">
                            <td colSpan="7">
                              <div className="delete-confirm-content">
                                <span>Remove <strong>{product.name}</strong> from your catalog? This can't be undone.</span>
                                <div className="delete-confirm-actions">
                                  <button className="btn btn-sm btn-danger" onClick={() => handleDeleteConfirm(product.id)}>Yes, remove it</button>
                                  <button className="btn btn-sm btn-secondary" onClick={() => { setDeletingId(null); setDeleteError(''); }}>Keep it</button>
                                </div>
                                {deleteError && <span className="delete-error">{deleteError}</span>}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
                {filteredProducts.length === 0 && (
                  <div className="empty-state"><p>Nothing matches that search — try a different word? 🔍</p></div>
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
                    <th>Order</th><th>Customer</th><th>Amount</th>
                    <th>Paid via</th><th>Date</th><th>Status</th>
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
                        <div className="status-cell">
                          <select
                            className="status-select"
                            value={order.status}
                            onChange={e => handleUpdateOrderStatus(order.id, e.target.value)}
                            style={{ color: statusColors[order.status] || 'inherit' }}
                          >
                            {statusOptions.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                          </select>
                          <span className="status-hint">{statusLabels[order.status]}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {orders.length === 0 && (
                <div className="empty-state">
                  <div style={{ fontSize: '3rem' }}>🛍️</div>
                  <h3>No orders have come in yet</h3>
                  <p>When customers place orders, you'll see them here.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
