// src/app/CreateBusiness.jsx
import React, { useState, useEffect } from 'react';
import { businessService } from '../services/api';
import '../styles/components.css';

export default function CreateBusiness() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Beauty',
    address: '',
    phone: '',
    image: '',
  });
  const [existingBusinessId, setExistingBusinessId] = useState(null);
  const [imageType, setImageType] = useState('url'); // 'url' or 'file'
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    async function loadExistingBusiness() {
      try {
        const res = await businessService.getMyBusiness();
        if (res.data && res.data.id) {
          setExistingBusinessId(res.data.id);
          setFormData({
            name: res.data.name || '',
            description: res.data.description || '',
            category: res.data.category || 'Beauty',
            address: res.data.address || '',
            phone: res.data.phone || '',
            image: res.data.image || '',
          });
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setFetching(false);
      }
    }
    loadExistingBusiness();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNavigate = (path) => {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new CustomEvent('navigate', { detail: { href: path } }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, image: reader.result })); // base64 data URL
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      let response;
      if (existingBusinessId) {
        response = await businessService.update(existingBusinessId, formData);
      } else {
        response = await businessService.create(formData);
      }
      if (response.error) {
        setError(response.error);
      } else {
        handleNavigate('/owner-dashboard');
      }
    } catch (err) {
      setError(err.message || 'Failed to save business profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNewInstead = () => {
    setExistingBusinessId(null);
    setFormData({
      name: '',
      description: '',
      category: 'Beauty',
      address: '',
      phone: '',
      image: '',
    });
  };


  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', padding: '3.5rem clamp(1.5rem, 4vw, 3.5rem)' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        {/* Navigation Breadcrumb */}
        <div style={{ marginBottom: '1.25rem' }}>
          <a href="/owner-dashboard" style={{ color: 'var(--text-muted)', fontSize: '0.88rem', textDecoration: 'none', fontWeight: 600 }}>
            &larr; Back to Dashboard
          </a>
        </div>

        {/* Deep Navy Banner Header */}
        <div
          style={{
            background: 'var(--navy-darkest)',
            color: '#FFFFFF',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '1.75rem 2rem',
            marginBottom: '2rem',
            boxShadow: '0 4px 14px rgba(15, 32, 56, 0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <div className="section-kicker section-kicker-light" style={{ marginBottom: '0.5rem' }}>
              Portal Administration
            </div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, margin: '0 0 0.35rem', letterSpacing: '-0.5px' }}>
              {existingBusinessId ? 'Edit Business Profile' : 'Create Business Profile'}
            </h1>
            <p style={{ color: '#94A3B8', fontSize: '0.92rem', margin: 0, lineHeight: 1.5 }}>
              {existingBusinessId
                ? 'Update your existing business information, address, and imagery.'
                : 'Register your institution or service business to publish verified live booking slots.'}
            </p>
          </div>
          {existingBusinessId && (
            <button
              type="button"
              onClick={handleCreateNewInstead}
              className="btn"
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                color: '#FFFFFF',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '9999px',
                padding: '0.5rem 1rem',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              + Create New Business Instead
            </button>
          )}
        </div>

        {error && (
          <div style={{ padding: '12px 16px', background: 'var(--danger-bg)', color: 'var(--danger)', borderRadius: '10px', marginBottom: '20px', border: '1px solid rgba(239, 68, 68, 0.25)', fontSize: '0.88rem', fontWeight: 600 }}>
            ! {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ background: '#FFFFFF', padding: '2.25rem', borderRadius: '16px', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
          <div className="form-group">
            <label className="label">Business name *</label>
            <input
              type="text"
              name="name"
              required
              placeholder="e.g. Luna Glow Salon"
              value={formData.name}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="label">Description *</label>
            <textarea
              name="description"
              required
              rows="3"
              placeholder="Brief description of what services you offer..."
              value={formData.description}
              onChange={handleChange}
              className="form-input"
              style={{ resize: 'vertical' }}
            />
          </div>

          <div className="form-group">
            <label className="label">Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="form-input"
              style={{ background: '#F8FAFC' }}
            >
              <option value="Beauty">Beauty</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Fitness">Fitness</option>
              <option value="Consulting">Consulting</option>
              <option value="Restaurants">Restaurants</option>
            </select>
          </div>

          <div className="form-group">
            <label className="label">Location / Address *</label>
            <input
              type="text"
              name="address"
              required
              placeholder="123 Main Street, Downtown"
              value={formData.address}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="label">Phone *</label>
            <input
              type="text"
              name="phone"
              required
              placeholder="+1 (555) 000-0000"
              value={formData.phone}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label className="label">Business Photo</label>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.75rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600 }}>
                <input
                  type="radio"
                  name="imageType"
                  value="url"
                  checked={imageType === 'url'}
                  onChange={() => setImageType('url')}
                />
                Image URL
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600 }}>
                <input
                  type="radio"
                  name="imageType"
                  value="file"
                  checked={imageType === 'file'}
                  onChange={() => setImageType('file')}
                />
                Upload from Computer
              </label>
            </div>

            {imageType === 'url' ? (
              <input
                type="url"
                name="image"
                placeholder="https://images.unsplash.com/..."
                value={formData.image.startsWith('data:') ? '' : formData.image}
                onChange={handleChange}
                className="form-input"
              />
            ) : (
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="form-input"
                style={{ padding: '8px' }}
              />
            )}

            {formData.image && (
              <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <img
                  src={formData.image}
                  alt="Business Preview"
                  style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border)' }}
                />
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, image: '' })}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--danger)',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                  }}
                >
                  Remove Image
                </button>
              </div>
            )}
            <small style={{ color: 'var(--text-muted)', display: 'block', marginTop: '6px', fontSize: '0.78rem' }}>
              Choose whether to paste a direct image URL or upload an image file from your PC.
            </small>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{
              width: '100%',
              padding: '12px 20px',
              borderRadius: '9999px',
              fontSize: '0.98rem',
              fontWeight: 800,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.75 : 1,
            }}
          >
            {loading
              ? 'Saving Profile...'
              : existingBusinessId
              ? 'Update Business Profile \u2192'
              : 'Create Business Profile \u2192'}
          </button>
        </form>
      </div>
    </div>
  );
}
