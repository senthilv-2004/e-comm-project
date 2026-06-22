import React, { useState } from 'react';
import { contactAPI } from '../../api/axios';
import './ContactPage.css';

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setStatus({ type: '', message: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setStatus({ type: 'error', message: 'Name, email, and message are required.' });
      return;
    }
    
    setLoading(true);
    try {
      const res = await contactAPI.sendEmail(formData);
      setStatus({ type: 'success', message: res.data.message });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.message || 'Failed to send message.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-container">
        <h1>Contact Us</h1>
        <p>Have a question? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
        
        {status.message && (
          <div className={`alert alert-${status.type}`}>
            {status.type === 'error' ? '⚠️' : '✅'} {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-group">
            <label htmlFor="name">Your Name</label>
            <input
              id="name" name="name" type="text"
              className="form-control" placeholder="John Doe"
              value={formData.name} onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email" name="email" type="email"
              className="form-control" placeholder="you@example.com"
              value={formData.email} onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="subject">Subject</label>
            <input
              id="subject" name="subject" type="text"
              className="form-control" placeholder="How can we help?"
              value={formData.subject} onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message" name="message" rows="5"
              className="form-control" placeholder="Write your message here..."
              value={formData.message} onChange={handleChange}
            />
          </div>

          <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
            {loading ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;
