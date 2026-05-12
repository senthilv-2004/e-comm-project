// src/pages/LoginPage/LoginPage.js
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authAPI } from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Redirect destination after login
  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please enter both email and password.');
      return;
    }
    setLoading(true);
    try {
      const res = await authAPI.login(formData);
      login(res.data.token, res.data.user);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Demo login helper
  const fillDemo = (role) => {
    if (role === 'admin') setFormData({ email: 'admin@shop.com', password: 'admin123' });
    else setFormData({ email: 'john@example.com', password: 'admin123' });
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Left Panel */}
        <div className="auth-left">
          <div className="auth-brand">
            <div className="auth-logo">🛍️</div>
            <h1>ShopEase</h1>
            <p>Your premium shopping destination</p>
          </div>
          <div className="auth-features">
            <div className="auth-feature"><span>✨</span> Thousands of products</div>
            <div className="auth-feature"><span>🔒</span> Secure & encrypted</div>
            <div className="auth-feature"><span>🚀</span> Fast delivery</div>
            <div className="auth-feature"><span>↩️</span> 30-day easy returns</div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="auth-right">
          <div className="auth-card">
            <div className="auth-card-header">
              <h2>Welcome back 👋</h2>
              <p>Sign in to continue shopping</p>
            </div>

            {/* Demo Buttons */}
            <div className="demo-buttons">
              <button className="demo-btn" onClick={() => fillDemo('user')}>
                👤 Demo User
              </button>
              <button className="demo-btn admin" onClick={() => fillDemo('admin')}>
                ⚙️ Demo Admin
              </button>
            </div>

            <div className="auth-divider"><span>or sign in manually</span></div>

            {error && <div className="alert alert-error">⚠️ {error}</div>}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <div className="input-wrapper">
                  <span className="input-icon">📧</span>
                  <input
                    id="email" name="email" type="email"
                    className="form-control" placeholder="you@example.com"
                    value={formData.email} onChange={handleChange} autoComplete="email"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password">
                  Password
                  <a href="#!" className="forgot-link" style={{ float: 'right' }}>Forgot password?</a>
                </label>
                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>
                  <input
                    id="password" name="password"
                    type={showPassword ? 'text' : 'password'}
                    className="form-control" placeholder="Enter your password"
                    value={formData.password} onChange={handleChange} autoComplete="current-password"
                  />
                  <button type="button" className="toggle-password" onClick={() => setShowPassword(p => !p)}>
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-lg auth-submit" disabled={loading}>
                {loading ? <><span className="spinner spinner-sm" /> Signing in...</> : '🚀 Sign In'}
              </button>
            </form>

            <p className="auth-switch">
              Don't have an account?{' '}
              <Link to="/register">Create one free →</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
