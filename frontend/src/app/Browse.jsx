// src/app/Browse.jsx
import React, { useEffect, useState } from 'react';
import { businessService } from '../services/api';
import { SearchIcon, BuildingIcon, StarIcon } from '../components/common/Icons';
import '../styles/components.css';

export default function Browse() {
  const [businesses, setBusinesses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBusinesses() {
      setLoading(true);
      const res = await businessService.getAll();
      if (!res.error) {
        setBusinesses(res.data || []);
      }
      setLoading(false);
    }
    fetchBusinesses();
  }, []);

  const categories = ['All', 'Beauty', 'Healthcare', 'Fitness', 'Consulting', 'Restaurants'];

  const filteredBusinesses = businesses.filter((b) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      b.category?.toLowerCase() === selectedCategory.toLowerCase();
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      b.name?.toLowerCase().includes(query) ||
      b.description?.toLowerCase().includes(query) ||
      b.address?.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  const handleReset = () => {
    setSearchQuery('');
    setSelectedCategory('All');
  };

  const goToBusiness = (id, e) => {
    e.preventDefault();
    const path = `/business/${id}`;
    window.history.pushState({}, '', path);
    window.dispatchEvent(new CustomEvent('navigate', { detail: { href: path } }));
  };

  return (
    <div className="browse-page" style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Editorial Deep Navy Hero Banner (Matching Photo Theme) */}
      <div
        className="hero-section"
        style={{
          backgroundColor: 'var(--navy-darkest)',
          color: '#FFFFFF',
          padding: 'clamp(3rem, 5vw, 4.5rem) clamp(1.5rem, 4vw, 3.5rem)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div className="section-kicker section-kicker-light" style={{ marginBottom: '1rem' }}>
            Verified Business Directory
          </div>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.25rem)', fontWeight: 800, margin: '0 0 12px 0', letterSpacing: '-0.8px' }}>
            Browse <span style={{ color: 'var(--teal-light)' }}>Verified Businesses</span>
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#94A3B8', margin: '0 0 28px 0', maxWidth: '640px', lineHeight: 1.6 }}>
            Discover verified businesses, check real-time availability, and book open appointments instantly.
          </p>

          {/* Search Box Pill */}
          <div style={{ position: 'relative', maxWidth: '520px' }}>
            <span
              style={{
                position: 'absolute',
                left: '18px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--teal-light)',
                display: 'flex',
                alignItems: 'center',
                pointerEvents: 'none',
                zIndex: 2,
              }}
            >
              <SearchIcon size={18} />
            </span>
            <input
              type="text"
              className="browse-search-input"
              placeholder="Search by name, service, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 20px 14px 54px',
                borderRadius: '9999px',
                border: '1.5px solid rgba(255, 255, 255, 0.25)',
                outline: 'none',
                fontSize: '0.96rem',
                color: '#FFFFFF',
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                boxSizing: 'border-box',
                backdropFilter: 'blur(8px)',
              }}
            />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2.5rem clamp(1.5rem, 4vw, 3.5rem)' }}>
        {/* Category Pills & Count */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', marginBottom: '30px' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '8px 20px',
                    borderRadius: '9999px',
                    border: isActive ? '1px solid var(--navy)' : '1px solid var(--border)',
                    backgroundColor: isActive ? 'var(--navy)' : '#FFFFFF',
                    color: isActive ? '#FFFFFF' : 'var(--text-dark)',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    transition: 'var(--transition)',
                    boxShadow: isActive ? '0 4px 12px rgba(15, 32, 56, 0.15)' : 'none',
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          <div style={{ color: 'var(--text-muted)', fontSize: '0.92rem', fontWeight: 600 }}>
            {filteredBusinesses.length} verified businesses
          </div>
        </div>

        {/* Business Results List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
            <div className="loading-spinner" style={{ marginBottom: '1rem' }} />
            <p>Loading verified businesses...</p>
          </div>
        ) : filteredBusinesses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', background: '#FFFFFF', borderRadius: '16px', border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--navy)', marginBottom: '10px' }}>
              No businesses found
            </h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
              Try adjusting your search query or category filters.
            </p>
            <button
              onClick={handleReset}
              className="btn btn-secondary"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '25px' }}>
            {filteredBusinesses.map((business) => {
              const bId = business.id || business._id;
              const imgUrl = business.image || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=800';

              return (
                <div
                  key={bId}
                  className="business-card"
                  style={{
                    border: '1px solid var(--border)',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    backgroundColor: '#FFFFFF',
                    boxShadow: 'var(--shadow)',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'var(--transition)',
                  }}
                >
                  <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
                    <img
                      src={imgUrl}
                      alt={business.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=800';
                      }}
                    />
                    <span
                      style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        background: 'rgba(15, 32, 56, 0.88)',
                        color: '#FFFFFF',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        padding: '0.25rem 0.65rem',
                        borderRadius: '9999px',
                        letterSpacing: '0.5px',
                        textTransform: 'uppercase',
                        backdropFilter: 'blur(4px)',
                      }}
                    >
                      {business.category}
                    </span>
                  </div>

                  <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--teal)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {business.category}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 8px 0', color: 'var(--navy)' }}>
                      {business.name}
                    </h3>

                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <BuildingIcon size={14} style={{ color: 'var(--teal)' }} /> {business.address}
                    </p>

                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px', flexGrow: 1, lineHeight: 1.5 }}>
                      {business.description}
                    </p>

                    <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '14px', marginTop: 'auto' }}>
                      <a
                        href={`/business/${bId}`}
                        onClick={(e) => goToBusiness(bId, e)}
                        className="btn-primary"
                        style={{
                          display: 'flex',
                          textAlign: 'center',
                          justifyContent: 'center',
                          alignItems: 'center',
                          gap: '0.5rem',
                          width: '100%',
                          padding: '10px 16px',
                          textDecoration: 'none',
                          fontWeight: 700,
                          fontSize: '0.92rem',
                          borderRadius: '9999px',
                        }}
                      >
                        <span>View Details &amp; Book</span>
                        <span>&rarr;</span>
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
