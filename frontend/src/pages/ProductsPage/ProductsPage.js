// src/pages/ProductsPage/ProductsPage.js - Product listing with filters
import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productAPI } from '../../api/axios';
import ProductCard from '../../components/ProductCard/ProductCard';
import './ProductsPage.css';

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // State
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // Filter state - read initial values from URL params
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || 'all',
    sort: searchParams.get('sort') || 'created_at',
    order: 'DESC',
    page: parseInt(searchParams.get('page')) || 1,
    limit: 12,
    featured: searchParams.get('featured') || '',
  });

  // Fetch categories once on mount
  useEffect(() => {
    productAPI.getCategories()
      .then(res => setCategories(res.data.categories || []))
      .catch(() => {});
  }, []);

  // Fetch products whenever filters change
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      // Build query params object (exclude empty values)
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.category !== 'all') params.category = filters.category;
      if (filters.sort) params.sort = filters.sort;
      if (filters.order) params.order = filters.order;
      if (filters.featured) params.featured = filters.featured;
      params.page = filters.page;
      params.limit = filters.limit;

      const res = await productAPI.getAll(params);
      setProducts(res.data.products || []);
      setTotalPages(res.data.totalPages || 1);
      setTotalProducts(res.data.total || 0);
    } catch (err) {
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProducts();
    // Scroll to top when filters change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [fetchProducts]);

  // Sync search params to URL for shareability
  useEffect(() => {
    const params = {};
    if (filters.search) params.search = filters.search;
    if (filters.category !== 'all') params.category = filters.category;
    if (filters.sort !== 'created_at') params.sort = filters.sort;
    if (filters.page > 1) params.page = filters.page;
    if (filters.featured) params.featured = filters.featured;
    setSearchParams(params);
  }, [filters, setSearchParams]);

  // Update a single filter and reset to page 1
  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  // Sort options
  const sortOptions = [
    { value: 'created_at', label: 'Newest First' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Top Rated' },
    { value: 'reviews_count', label: 'Most Reviewed' },
  ];

  // Handle sort change (parses combined value+order)
  const handleSortChange = (val) => {
    if (val === 'price_asc') {
      setFilters(prev => ({ ...prev, sort: 'price', order: 'ASC', page: 1 }));
    } else if (val === 'price_desc') {
      setFilters(prev => ({ ...prev, sort: 'price', order: 'DESC', page: 1 }));
    } else {
      setFilters(prev => ({ ...prev, sort: val, order: 'DESC', page: 1 }));
    }
  };

  // Get current sort option value for select
  const currentSortValue = filters.sort === 'price'
    ? (filters.order === 'ASC' ? 'price_asc' : 'price_desc')
    : filters.sort;

  return (
    <div className="products-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="container">
          <h1>🛍️ Our <span className="gradient-text">Products</span></h1>
          <p>Discover {totalProducts > 0 ? `${totalProducts} amazing` : 'our'} products</p>
        </div>
      </div>

      <div className="container">
        <div className="products-layout">

          {/* ---- Sidebar Filters ---- */}
          <aside className="filters-sidebar">
            <h3 className="filters-title">🔧 Filters</h3>

            {/* Search Filter */}
            <div className="filter-group">
              <label>Search</label>
              <div className="search-input-wrapper">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search products..."
                  value={filters.search}
                  onChange={(e) => updateFilter('search', e.target.value)}
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="filter-group">
              <label>Category</label>
              <div className="filter-options">
                <button
                  className={`filter-chip ${filters.category === 'all' ? 'active' : ''}`}
                  onClick={() => updateFilter('category', 'all')}
                >
                  All Categories
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.category}
                    className={`filter-chip ${filters.category === cat.category ? 'active' : ''}`}
                    onClick={() => updateFilter('category', cat.category)}
                  >
                    {cat.category}
                    <span className="chip-count">{cat.count}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Featured Filter */}
            <div className="filter-group">
              <label>Special</label>
              <button
                className={`filter-chip ${filters.featured === 'true' ? 'active' : ''}`}
                onClick={() => updateFilter('featured', filters.featured === 'true' ? '' : 'true')}
              >
                ⚡ Featured Only
              </button>
            </div>

            {/* Reset */}
            <button
              className="btn btn-secondary btn-sm"
              style={{ width: '100%', marginTop: 'var(--space-md)' }}
              onClick={() => setFilters({
                search: '', category: 'all', sort: 'created_at',
                order: 'DESC', page: 1, limit: 12, featured: ''
              })}
            >
              ✕ Reset Filters
            </button>
          </aside>

          {/* ---- Products Area ---- */}
          <div className="products-main">
            {/* Toolbar */}
            <div className="products-toolbar">
              <p className="results-count">
                {loading ? 'Loading...' : `${totalProducts} products found`}
              </p>
              <select
                className="sort-select"
                value={currentSortValue}
                onChange={(e) => handleSortChange(e.target.value)}
              >
                {sortOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Error State */}
            {error && (
              <div className="alert alert-error">
                ⚠️ {error}
                <button onClick={fetchProducts} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>
                  Retry
                </button>
              </div>
            )}

            {/* Loading State */}
            {loading ? (
              <div className="products-grid">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="product-skeleton">
                    <div className="skeleton" style={{ aspectRatio: '4/3' }} />
                    <div style={{ padding: 'var(--space-md)', display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                      <div className="skeleton" style={{ height: '16px', width: '60%' }} />
                      <div className="skeleton" style={{ height: '20px' }} />
                      <div className="skeleton" style={{ height: '14px', width: '80%' }} />
                      <div className="skeleton" style={{ height: '36px', borderRadius: '999px' }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              /* Empty State */
              <div className="empty-state">
                <div style={{ fontSize: '4rem', marginBottom: 'var(--space-md)' }}>🔍</div>
                <h3>No products found</h3>
                <p>Try adjusting your filters or search term.</p>
                <button
                  className="btn btn-primary"
                  style={{ marginTop: 'var(--space-lg)' }}
                  onClick={() => setFilters({ search: '', category: 'all', sort: 'created_at', order: 'DESC', page: 1, limit: 12, featured: '' })}
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              /* Products Grid */
              <>
                <div className="products-grid">
                  {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="pagination">
                    <button
                      className="page-btn"
                      onClick={() => updateFilter('page', filters.page - 1)}
                      disabled={filters.page <= 1}
                    >
                      ← Prev
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(p => Math.abs(p - filters.page) <= 2 || p === 1 || p === totalPages)
                      .map((p, idx, arr) => (
                        <React.Fragment key={p}>
                          {idx > 0 && arr[idx - 1] !== p - 1 && <span className="page-ellipsis">...</span>}
                          <button
                            className={`page-btn ${p === filters.page ? 'active' : ''}`}
                            onClick={() => updateFilter('page', p)}
                          >
                            {p}
                          </button>
                        </React.Fragment>
                      ))}

                    <button
                      className="page-btn"
                      onClick={() => updateFilter('page', filters.page + 1)}
                      disabled={filters.page >= totalPages}
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
