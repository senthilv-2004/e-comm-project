// src/pages/LoginPage/LoginPage.js
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authAPI } from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
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
      setError("Looks like you missed a spot — we need both your email and password.");
      return;
    }
    setLoading(true);
    try {
      const res = await authAPI.login(formData);
      login(res.data.token, res.data.user);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Hmm, we couldn't log you in. Want to try that again?");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      const res = await authAPI.googleLogin(credentialResponse.credential);
      login(res.data.token, res.data.user);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Google sign-in failed. Please try again.");
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
            <div className="auth-feature"><span>✨</span> Things you'll actually love</div>
            <div className="auth-feature"><span>🔒</span> Safe, secure, and private</div>
            <div className="auth-feature"><span>🚀</span> Fast delivery to your door</div>
            <div className="auth-feature"><span>↩️</span> No-stress 30-day returns</div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="auth-right">
          <div className="auth-card">
            <div className="auth-card-header">
              <h2>Good to see you again 👋</h2>
              <p>Let's get you signed in.</p>
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

            <div className="google-login-container" style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem' }}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => {
                  setError('Google Login Failed');
                }}
                useOneTap
              />
            </div>

            <div className="auth-divider"><span>or sign in the usual way</span></div>

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
                {loading ? <><span className="spinner spinner-sm" /> Getting things ready…</> : '✨ Let me in'}
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
