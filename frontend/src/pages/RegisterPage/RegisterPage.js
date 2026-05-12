// src/pages/RegisterPage/RegisterPage.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import '../LoginPage/LoginPage.css';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      setError('All fields are required.'); return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.'); return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.'); return;
    }
    if (!agreed) {
      setError('Please agree to the Terms of Service.'); return;
    }
    setLoading(true);
    try {
      const res = await authAPI.register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      login(res.data.token, res.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Password strength meter
  const getPasswordStrength = () => {
    const p = formData.password;
    if (!p) return { label: '', color: '', width: '0%' };
    if (p.length < 6) return { label: 'Weak', color: 'var(--danger)', width: '25%' };
    if (p.length < 8) return { label: 'Fair', color: 'var(--warning)', width: '50%' };
    if (/(?=.*[A-Z])(?=.*[0-9])/.test(p)) return { label: 'Strong', color: 'var(--success)', width: '100%' };
    return { label: 'Good', color: '#38f9d7', width: '75%' };
  };
  const strength = getPasswordStrength();

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Left Panel */}
        <div className="auth-left">
          <div className="auth-brand">
            <div className="auth-logo">🛍️</div>
            <h1>Join ShopEase</h1>
            <p>Create your free account today</p>
          </div>
          <div className="auth-features">
            <div className="auth-feature"><span>🎁</span> Exclusive member deals</div>
            <div className="auth-feature"><span>📦</span> Track your orders</div>
            <div className="auth-feature"><span>💳</span> Saved payment methods</div>
            <div className="auth-feature"><span>⚡</span> Faster checkout</div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="auth-right">
          <div className="auth-card">
            <div className="auth-card-header">
              <h2>Create Account ✨</h2>
              <p>It's free and only takes a minute</p>
            </div>

            {error && <div className="alert alert-error">⚠️ {error}</div>}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <div className="input-wrapper">
                  <span className="input-icon">👤</span>
                  <input id="name" name="name" type="text"
                    className="form-control" placeholder="John Doe"
                    value={formData.name} onChange={handleChange} autoComplete="name"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <div className="input-wrapper">
                  <span className="input-icon">📧</span>
                  <input id="email" name="email" type="email"
                    className="form-control" placeholder="you@example.com"
                    value={formData.email} onChange={handleChange} autoComplete="email"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>
                  <input id="password" name="password"
                    type={showPassword ? 'text' : 'password'}
                    className="form-control" placeholder="Min. 6 characters"
                    value={formData.password} onChange={handleChange}
                  />
                  <button type="button" className="toggle-password" onClick={() => setShowPassword(p => !p)}>
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
                {/* Password Strength Bar */}
                {formData.password && (
                  <div style={{ marginTop: '6px' }}>
                    <div style={{ height: '4px', background: 'var(--border)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: strength.width, background: strength.color, transition: 'all 0.3s', borderRadius: '2px' }} />
                    </div>
                    <span style={{ fontSize: '0.75rem', color: strength.color, fontWeight: 600 }}>{strength.label}</span>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="input-wrapper">
                  <span className="input-icon">🔐</span>
                  <input id="confirmPassword" name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    className="form-control" placeholder="Repeat your password"
                    value={formData.confirmPassword} onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="terms-check">
                  <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} />
                  <span>
                    I agree to the <a href="#!">Terms of Service</a> and{' '}
                    <a href="#!">Privacy Policy</a>
                  </span>
                </label>
              </div>

              <button type="submit" className="btn btn-primary btn-lg auth-submit" disabled={loading}>
                {loading ? <><span className="spinner spinner-sm" /> Creating account...</> : '🚀 Create Account'}
              </button>
            </form>

            <p className="auth-switch">
              Already have an account?{' '}
              <Link to="/login">Sign in →</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
