import React, { useEffect, useState } from 'react';
import { businessService, serviceService, bookingService, availabilityService } from '../services/api';
import { useAuth } from '../context/auth.context';
import { BuildingIcon, ClockIcon } from '../components/common/Icons';

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
      <div className="py-24 px-4 text-center min-h-[60vh] flex flex-col items-center justify-center bg-[#FAF7F2]">
        <div className="w-8 h-8 border-3 border-[#203626] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm text-[#636D62]">Loading business profile...</p>
      </div>
    );
  }

  if (error && !business) {
    return (
      <div className="py-24 px-4 text-center text-[#C0392B] min-h-[60vh] bg-[#FAF7F2]">
        <h3 className="text-xl font-bold mb-4">{error}</h3>
        <a href="/browse" className="inline-flex px-6 py-2 rounded-full bg-[#203626] text-white font-bold text-sm shadow no-underline">
          Back to Browse
        </a>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="py-24 px-4 text-center min-h-[60vh] bg-[#FAF7F2]">
        <h3 className="text-xl font-bold text-[#16261A] mb-4">Business not found.</h3>
        <a href="/browse" className="inline-flex px-6 py-2 rounded-full bg-[#203626] text-white font-bold text-sm shadow no-underline">
          Back to Browse
        </a>
      </div>
    );
  }

  const businessImage = business.image || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=800';

  return (
    <div className="w-full bg-[#FAF7F2] min-h-screen py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-7xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <a
            href="/browse"
            className="text-xs sm:text-sm font-bold text-[#636D62] hover:text-[#16261A] transition-colors inline-flex items-center gap-1.5 no-underline"
          >
            &larr; Back to Directory
          </a>
        </div>

        {/* Hero Business Banner */}
        <div className="relative rounded-3xl overflow-hidden shadow-lg mb-8 border border-[#E8E2D5] sunnah-card-hover group">
          <img 
            src={businessImage} 
            alt={business.name} 
            className="w-full h-72 sm:h-96 object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=800'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#16261A]/95 via-[#16261A]/40 to-transparent flex flex-col justify-end p-6 sm:p-10 text-white">
            <span className="self-start bg-[#C49337] text-white text-[0.68rem] font-black px-3.5 py-1 rounded-full uppercase tracking-wider mb-2">
              {business.category}
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight my-2">
              {business.name}
            </h1>
            <p className="text-xs sm:text-sm text-[#C8D1C4] flex items-center gap-4 flex-wrap m-0">
              <span>📍 {business.address || business.location}</span>
              {business.phone && <span>📞 {business.phone}</span>}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: About & Services (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            {/* About Card */}
            <section className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8E2D5] shadow-sm sunnah-card-hover">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#A37422] mb-3">
                <span className="w-4 h-0.5 bg-[#C49337] rounded-full" />
                Overview
              </div>
              <h2 className="text-xl font-bold text-[#16261A] mb-3">About Us</h2>
              <p className="text-xs sm:text-sm text-[#556054] leading-relaxed m-0">
                {business.description}
              </p>
            </section>

            {/* Services List */}
            <section>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#A37422] mb-3">
                <span className="w-4 h-0.5 bg-[#C49337] rounded-full" />
                Service Offerings
              </div>
              <h2 className="text-xl font-bold text-[#16261A] mb-4">
                Select a Service ({services.length})
              </h2>

              {services.length === 0 ? (
                <div className="bg-white p-8 rounded-3xl border border-[#E8E2D5] text-center text-xs sm:text-sm text-[#636D62]">
                  No services listed yet for this business.
                </div>
              ) : (
                <div className="flex flex-col gap-3.5">
                  {services.map((service) => {
                    const sId = service.id || service._id;
                    const isSelected = selectedService && (selectedService.id === sId || selectedService._id === sId);
                    
                    return (
                      <div 
                        key={sId}
                        onClick={() => setSelectedService(service)}
                        className={`p-5 rounded-3xl border cursor-pointer transition-all duration-200 flex justify-between items-center gap-4 sunnah-card-hover ${
                          isSelected
                            ? 'bg-[#FFF8E6] border-[#C49337] shadow-md ring-2 ring-[#C49337]/20'
                            : 'bg-white border-[#E8E2D5] hover:border-[#C49337]/50 shadow-sm'
                        }`}
                      >
                        <div>
                          <h4 className="text-base font-bold text-[#16261A] mb-1">{service.name}</h4>
                          <p className="text-xs text-[#556054] mb-2">{service.description}</p>
                          <span className="text-xs font-bold text-[#16261A] inline-flex items-center gap-1.5">
                            <ClockIcon size={14} className="text-[#C49337]" /> {service.duration} Mins
                          </span>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className="text-xl font-black text-[#C49337]">${service.price}</span>
                          <div className="mt-2">
                            <button 
                              type="button" 
                              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border-none ${
                                isSelected ? 'bg-[#C49337] text-white shadow-sm' : 'bg-[#203626] text-white hover:bg-[#16261A]'
                              }`}
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

          {/* Right Column: Dynamic Availability Booking Widget (5 cols) */}
          <div className="lg:col-span-5">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8E2D5] sticky top-24 shadow-md sunnah-card-hover">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#A37422] mb-2">
                <span className="w-4 h-0.5 bg-[#C49337] rounded-full" />
                Conflict-Free Booking
              </div>
              <h3 className="text-xl font-bold text-[#16261A] mb-2">Book Appointment</h3>
              
              {selectedService ? (
                <div className="my-4 p-4 bg-[#FFF8E6] rounded-2xl border border-[#E8D5A0]">
                  <p className="font-black text-[#16261A] text-sm mb-1">{selectedService.name}</p>
                  <p className="text-xs font-bold text-[#C49337] m-0">
                    ${selectedService.price} &bull; {selectedService.duration} mins
                  </p>
                </div>
              ) : (
                <p className="text-xs text-[#636D62] my-4 leading-relaxed">
                  Select a service from the left list to choose your appointment slot.
                </p>
              )}

              {error && (
                <div className="p-3 bg-[#FEF5F4] text-[#C0392B] border border-[#F5C2BE] rounded-xl text-xs font-bold mb-4">
                  ! {error}
                </div>
              )}
              {successMsg && (
                <div className="p-3 bg-[#F0F7F0] text-[#203626] border border-[#C5DEC0] rounded-xl text-xs font-bold mb-4">
                  ✓ {successMsg}
                </div>
              )}

              <form onSubmit={handleBookingSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#16261A] mb-1.5">
                    1. Choose Date
                  </label>
                  <input
                    type="date"
                    required
                    min={todayStr}
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-[#E8E2D5] bg-[#FAF7F2] text-[#16261A] outline-none focus:border-[#C49337] focus:ring-2 focus:ring-[#C49337]/20 transition-all"
                  />
                </div>

                {bookingDate && (
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-xs font-bold text-[#16261A]">
                        2. Choose Verified Time Slot
                      </label>
                      {slotsLoading && <span className="text-[0.7rem] text-[#C49337] font-semibold">Checking slots...</span>}
                    </div>

                    {slotsMessage && (
                      <p className="text-xs text-[#636D62] italic my-1.5">
                        {slotsMessage}
                      </p>
                    )}

                    {availableSlots.length > 0 && (
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-2 max-h-44 overflow-y-auto p-1">
                        {availableSlots.map((timeSlot) => {
                          const isPicked = bookingTime === timeSlot;
                          return (
                            <button
                              key={timeSlot}
                              type="button"
                              onClick={() => setBookingTime(timeSlot)}
                              className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                                isPicked
                                  ? 'bg-[#203626] text-white border-[#203626] shadow-sm'
                                  : 'bg-[#FAF7F2] text-[#16261A] border-[#E8E2D5] hover:bg-[#F2ECE0]'
                              }`}
                            >
                              {timeSlot}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {bookingTime && (
                      <div className="mt-2 text-xs font-bold text-[#203626] bg-[#F0F7F0] p-2 rounded-lg border border-[#C5DEC0]">
                        ✓ Selected Slot: {bookingTime}
                      </div>
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!selectedService || !bookingDate || !bookingTime || submitting}
                  className="w-full py-3 px-6 rounded-full bg-[#203626] hover:bg-[#16261A] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer border-none mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
