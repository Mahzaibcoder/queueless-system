// frontend/src/app/BusinessDetail.jsx
import React, { useEffect, useState } from 'react';
import { businessService, serviceService, bookingService, availabilityService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { BuildingIcon, ClockIcon, CheckCircleIcon, ArrowRightIcon } from '../components/common/Icons';
import '../styles/components.css';

export default function BusinessDetail({ id: propId }) {
  const routeId = propId || (typeof window !== 'undefined' ? window.location.pathname.split('/').pop() : null);
  const id = routeId;

  const { user, isAuthenticated } = useAuth();

  const [business, setBusiness] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsMessage, setSlotsMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    async function fetchBusinessData() {
      setLoading(true);
      const [bizRes, servRes] = await Promise.all([
        businessService.getById(id),
        serviceService.getByBusiness(id),
      ]);

      if (bizRes.data) {
        setBusiness(bizRes.data);
      } else {
        setError(bizRes.error || 'Business not found.');
      }

      if (servRes.data) {
        setServices(servRes.data);
        if (servRes.data.length > 0) {
          setSelectedService(servRes.data[0]);
        }
      }

      setLoading(false);
    }

    if (id) {
      fetchBusinessData();
    }
  }, [id]);

  // Compute available slots when date or service changes
  useEffect(() => {
    async function fetchSlots() {
      if (!id || !bookingDate) {
        setAvailableSlots([]);
        setSlotsMessage('');
        return;
      }

      setSlotsLoading(true);
      setSlotsMessage('');
      setBookingTime('');

      const dur = selectedService ? selectedService.duration : 30;
      const res = await availabilityService.getSlots(id, bookingDate, dur);

      setSlotsLoading(false);
      if (res.data) {
        if (res.data.isClosed) {
          setAvailableSlots([]);
          setSlotsMessage('Business is closed on this day. Please select another date.');
        } else if (res.data.availableSlots && res.data.availableSlots.length > 0) {
          setAvailableSlots(res.data.availableSlots);
          setSlotsMessage('');
        } else {
          setAvailableSlots([]);
          setSlotsMessage('All slots are booked for this date. Please choose another date.');
        }
      } else {
        // Fallback default slots if no custom availability is configured
        const fallback = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];
        setAvailableSlots(fallback);
      }
    }

    fetchSlots();
  }, [id, bookingDate, selectedService]);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!selectedService || !bookingDate || !bookingTime) {
      setError('Please select a service, date, and an open time slot.');
      return;
    }

    if (!isAuthenticated) {
      setError('Please sign in to confirm your appointment.');
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('navigate', { detail: { href: '/login' } }));
      }, 1500);
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        businessId: id,
        businessName: business.name,
        serviceId: selectedService.id || selectedService._id,
        serviceName: selectedService.name,
        duration: selectedService.duration,
        price: selectedService.price,
        date: bookingDate,
        time: bookingTime,
        userId: user?.id,
      };

      const res = await bookingService.create(payload);
      setSubmitting(false);

      if (res.error) {
        setError(res.error);
      } else {
        setSuccessMsg(`Appointment booked successfully for ${selectedService.name} on ${bookingDate} at ${bookingTime}!`);
        // Refresh slot list by re-fetching
        setBookingTime('');
        const dur = selectedService.duration || 30;
        const slotRes = await availabilityService.getSlots(id, bookingDate, dur);
        if (slotRes.data?.availableSlots) {
          setAvailableSlots(slotRes.data.availableSlots);
        }
      }
    } catch (err) {
      setSubmitting(false);
      setError(err.message || 'Conflict: This slot is already booked or unavailable.');
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '80px 20px', textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div className="loading-spinner" style={{ marginBottom: '1rem' }} />
        <p style={{ color: 'var(--text-muted)' }}>Loading business profile from MongoDB...</p>
      </div>
    );
  }

  if (error && !business) {
    return (
      <div style={{ padding: '80px 20px', textAlign: 'center', color: 'var(--danger)', minHeight: '60vh' }}>
        <h3>{error}</h3>
        <a href="/browse" className="btn btn-secondary" style={{ marginTop: '1rem' }}>
          Back to Browse
        </a>
      </div>
    );
  }

  if (!business) {
    return (
      <div style={{ padding: '80px 20px', textAlign: 'center', minHeight: '60vh' }}>
        <h3>Business not found in database.</h3>
        <a href="/browse" className="btn btn-secondary" style={{ marginTop: '1rem' }}>
          Back to Browse
        </a>
      </div>
    );
  }

  const businessImage = business.image || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=800';

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', padding: '2.5rem clamp(1.5rem, 4vw, 3.5rem)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Navigation Breadcrumb */}
        <div style={{ marginBottom: '1.25rem' }}>
          <a href="/browse" style={{ color: 'var(--text-muted)', fontSize: '0.88rem', textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            &larr; Back to Directory
          </a>
        </div>

        {/* Hero Business Banner */}
        <div style={{ position: 'relative', borderRadius: '20px', overflow: 'hidden', boxShadow: 'var(--shadow-card)', marginBottom: '30px', border: '1px solid var(--border)' }}>
          <img 
            src={businessImage} 
            alt={business.name} 
            style={{ width: '100%', height: '320px', objectFit: 'cover' }}
            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=800'; }}
          />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(8, 20, 34, 0.94) 0%, rgba(8, 20, 34, 0.5) 60%, transparent 100%)', color: '#FFFFFF', padding: '2.5rem 2rem' }}>
            <span style={{ background: 'var(--teal)', color: '#FFFFFF', padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {business.category}
            </span>
            <h1 style={{ margin: '10px 0 6px 0', fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: 800 }}>{business.name}</h1>
            <p style={{ margin: '0', color: '#CBD5E1', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <span>📍 {business.address || business.location}</span>
              {business.phone && <span>📞 {business.phone}</span>}
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1.4fr', gap: '30px' }}>
          <div>
            {/* About Card */}
            <section style={{ marginBottom: '30px', background: '#FFFFFF', padding: '24px', borderRadius: '16px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
              <div className="section-kicker" style={{ marginBottom: '0.5rem' }}>Overview</div>
              <h2 style={{ color: 'var(--navy)', fontWeight: 800, fontSize: '1.35rem', marginBottom: '0.75rem' }}>About Us</h2>
              <p style={{ lineHeight: '1.7', color: 'var(--text-muted)', fontSize: '0.96rem' }}>{business.description}</p>
            </section>

            {/* Services List */}
            <section>
              <div className="section-kicker" style={{ marginBottom: '0.5rem' }}>Service Offerings</div>
              <h2 style={{ color: 'var(--navy)', fontWeight: 800, fontSize: '1.35rem', marginBottom: '1rem' }}>
                Select a Service ({services.length})
              </h2>
              {services.length === 0 ? (
                <div style={{ background: '#FFFFFF', padding: '2rem', borderRadius: '14px', border: '1px solid var(--border)', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No services listed yet for this business.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {services.map((service) => {
                    const sId = service.id || service._id;
                    const isSelected = selectedService && (selectedService.id === sId || selectedService._id === sId);
                    
                    return (
                      <div 
                        key={sId}
                        onClick={() => setSelectedService(service)}
                        style={{
                          padding: '20px',
                          borderRadius: '14px',
                          border: isSelected ? '2px solid var(--teal)' : '1px solid var(--border)',
                          background: isSelected ? 'var(--teal-bg)' : '#FFFFFF',
                          cursor: 'pointer',
                          transition: 'var(--transition)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: '1rem',
                          boxShadow: isSelected ? '0 4px 14px rgba(0, 163, 137, 0.12)' : 'var(--shadow-sm)',
                        }}
                      >
                        <div>
                          <h4 style={{ margin: '0 0 5px 0', fontSize: '1.1rem', fontWeight: 800, color: 'var(--navy)' }}>{service.name}</h4>
                          <p style={{ margin: '0 0 8px 0', color: 'var(--text-muted)', fontSize: '0.88rem' }}>{service.description}</p>
                          <span style={{ fontSize: '0.82rem', color: 'var(--navy)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                            <ClockIcon size={14} style={{ color: 'var(--teal)' }} /> {service.duration} Mins
                          </span>
                        </div>
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--teal-dark)' }}>${service.price}</span>
                          <div style={{ marginTop: '8px' }}>
                            <button 
                              type="button" 
                              style={{
                                padding: '6px 14px',
                                background: isSelected ? 'var(--teal)' : 'var(--navy)',
                                color: '#FFFFFF',
                                border: 'none',
                                borderRadius: '9999px',
                                cursor: 'pointer',
                                fontWeight: 700,
                                fontSize: '0.82rem',
                                transition: 'var(--transition)',
                              }}
                            >
                              {isSelected ? '✓ Selected' : 'Select'}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>

          {/* Right Column: Dynamic Availability Booking Widget */}
          <div>
            <div style={{ background: '#FFFFFF', padding: '28px', borderRadius: '18px', border: '1px solid var(--border)', position: 'sticky', top: '100px', boxShadow: 'var(--shadow-card)' }}>
              <div className="section-kicker" style={{ marginBottom: '0.4rem' }}>Conflict-Free Booking</div>
              <h3 style={{ color: 'var(--navy)', fontWeight: 800, fontSize: '1.3rem', marginBottom: '0.5rem' }}>Book Appointment</h3>
              
              {selectedService ? (
                <div style={{ margin: '14px 0 20px', padding: '14px', background: 'var(--teal-bg)', borderRadius: '12px', border: '1px solid var(--teal-border)' }}>
                  <p style={{ margin: '0 0 4px 0', fontWeight: 800, color: 'var(--navy)', fontSize: '0.98rem' }}>{selectedService.name}</p>
                  <p style={{ margin: '0', color: 'var(--teal-dark)', fontWeight: 800, fontSize: '0.92rem' }}>
                    ${selectedService.price} &bull; {selectedService.duration} mins
                  </p>
                </div>
              ) : (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: '14px 0 20px', lineHeight: 1.5 }}>
                  Select a service from the left list to choose your appointment slot.
                </p>
              )}

              {error && (
                <div style={{ color: 'var(--danger)', background: 'var(--danger-bg)', padding: '10px 14px', borderRadius: '10px', fontSize: '0.85rem', marginBottom: '14px', border: '1px solid rgba(239, 68, 68, 0.25)', fontWeight: 600 }}>
                  ! {error}
                </div>
              )}
              {successMsg && (
                <div style={{ color: 'var(--teal-dark)', background: 'var(--teal-bg)', padding: '10px 14px', borderRadius: '10px', fontSize: '0.85rem', marginBottom: '14px', border: '1px solid var(--teal-border)', fontWeight: 700 }}>
                  ✓ {successMsg}
                </div>
              )}

              <form onSubmit={handleBookingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="label">1. Choose Date</label>
                  <input
                    type="date"
                    required
                    min={todayStr}
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="form-input"
                  />
                </div>

                {bookingDate && (
                  <div className="form-group" style={{ margin: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                      <label className="label" style={{ margin: 0 }}>2. Choose Verified Time Slot</label>
                      {slotsLoading && <span style={{ fontSize: '0.78rem', color: 'var(--teal-dark)' }}>Checking slots...</span>}
                    </div>

                    {slotsMessage && (
                      <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', fontStyle: 'italic', margin: '0.35rem 0' }}>
                        {slotsMessage}
                      </p>
                    )}

                    {availableSlots.length > 0 && (
                      <div className="slot-grid" style={{ marginTop: '0.5rem', maxHeight: '180px', overflowY: 'auto', padding: '2px' }}>
                        {availableSlots.map((timeSlot) => {
                          const isPicked = bookingTime === timeSlot;
                          return (
                            <button
                              key={timeSlot}
                              type="button"
                              onClick={() => setBookingTime(timeSlot)}
                              style={{
                                padding: '8px 10px',
                                borderRadius: '8px',
                                border: isPicked ? '2px solid var(--navy)' : '1px solid var(--border)',
                                background: isPicked ? 'var(--navy)' : '#FFFFFF',
                                color: isPicked ? '#FFFFFF' : 'var(--text-dark)',
                                fontWeight: 700,
                                fontSize: '0.88rem',
                                cursor: 'pointer',
                                transition: 'var(--transition)',
                              }}
                            >
                              {timeSlot}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {bookingTime && (
                      <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--teal-dark)', fontWeight: 700 }}>
                        ✓ Selected Slot: {bookingTime}
                      </div>
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!selectedService || !bookingDate || !bookingTime || submitting}
                  className="btn-primary"
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '9999px',
                    fontWeight: 800,
                    fontSize: '0.96rem',
                    cursor: (!selectedService || !bookingDate || !bookingTime || submitting) ? 'not-allowed' : 'pointer',
                    opacity: (!selectedService || !bookingDate || !bookingTime || submitting) ? 0.5 : 1,
                    marginTop: '0.5rem',
                  }}
                >
                  {submitting ? 'Confirming...' : 'Confirm Appointment \u2192'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
