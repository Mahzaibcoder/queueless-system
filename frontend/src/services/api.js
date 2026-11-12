// frontend/src/services/api.js

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper to normalize MongoDB _id to id
const normalizeId = (item) => {
  if (!item) return item;
  if (Array.isArray(item)) return item.map(normalizeId);
  return {
    ...item,
    id: item.id || item._id,
  };
};

// Helper to get auth header
const getAuthHeaders = () => {
  const session = localStorage.getItem('queueless_auth_session');
  if (!session) return { 'Content-Type': 'application/json' };
  try {
    const user = JSON.parse(session);
    return {
      'Content-Type': 'application/json',
      ...(user.token ? { 'Authorization': `Bearer ${user.token}` } : {}),
    };
  } catch (e) {
    return { 'Content-Type': 'application/json' };
  }
};

// Auth Service
export const authService = {
  login: async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) return { user: null, error: data.error || 'Login failed' };
      const normalizedUser = normalizeId(data.user || data);
      localStorage.setItem('queueless_auth_session', JSON.stringify(normalizedUser));
      return { user: normalizedUser, error: null };
    } catch (err) {
      return { user: null, error: err.message };
    }
  },
  register: async (userData) => {
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const data = await res.json();
      if (!res.ok) return { user: null, error: data.error || 'Registration failed' };
      const normalizedUser = normalizeId(data.user || data);
      localStorage.setItem('queueless_auth_session', JSON.stringify(normalizedUser));
      return { user: normalizedUser, error: null };
    } catch (err) {
      return { user: null, error: err.message };
    }
  },
  logout: async () => {
    localStorage.removeItem('queueless_auth_session');
    return { error: null };
  },
  getCurrentUser: async () => {
    try {
      const session = localStorage.getItem('queueless_auth_session');
      if (!session) return { user: null, error: null };
      const user = JSON.parse(session);
      return { user: normalizeId(user), error: null };
    } catch (e) {
      return { user: null, error: null };
    }
  },
};

// Businesses Service
export const businessService = {
  getAll: async () => {
    try {
      const res = await fetch(`${API_URL}/businesses`);
      const data = await res.json();
      return { data: normalizeId(data) || [], error: res.ok ? null : 'Failed to fetch businesses' };
    } catch (err) {
      return { data: [], error: err.message };
    }
  },
  getById: async (id) => {
    try {
      const res = await fetch(`${API_URL}/businesses/${id}`);
      const data = await res.json();
      return { data: res.ok ? normalizeId(data) : null, error: res.ok ? null : 'Business not found' };
    } catch (err) {
      return { data: null, error: err.message };
    }
  },
  getMyBusiness: async () => {
    try {
      const res = await fetch(`${API_URL}/businesses/me`, { headers: getAuthHeaders() });
      const data = await res.json();
      return { data: res.ok ? normalizeId(data) : null, error: res.ok ? null : (data.error || 'No business found') };
    } catch (err) {
      return { data: null, error: err.message };
    }
  },
  getMyBusinesses: async () => {
    try {
      const res = await fetch(`${API_URL}/businesses/my/all`, { headers: getAuthHeaders() });
      const data = await res.json();
      return { data: res.ok ? normalizeId(data) : [], error: res.ok ? null : (data.error || 'Failed to fetch businesses') };
    } catch (err) {
      return { data: [], error: err.message };
    }
  },
  create: async (payload) => {
    try {
      const res = await fetch(`${API_URL}/businesses`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      return { data: res.ok ? normalizeId(data) : null, error: res.ok ? null : (data.error || 'Failed to create business') };
    } catch (err) {
      return { data: null, error: err.message };
    }
  },
  update: async (id, payload) => {
    try {
      const res = await fetch(`${API_URL}/businesses/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      return { data: res.ok ? normalizeId(data) : null, error: res.ok ? null : (data.error || 'Failed to update business') };
    } catch (err) {
      return { data: null, error: err.message };
    }
  },
  delete: async (id) => {
    try {
      const res = await fetch(`${API_URL}/businesses/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      return { data: res.ok ? data : null, error: res.ok ? null : (data.error || 'Failed to delete business') };
    } catch (err) {
      return { data: null, error: err.message };
    }
  },
};

// Services Service
export const serviceService = {
  getByBusiness: async (businessId) => {
    try {
      const res = await fetch(`${API_URL}/services/business/${businessId}`);
      const data = await res.json();
      return { data: normalizeId(data) || [], error: res.ok ? null : 'Failed to fetch services' };
    } catch (err) {
      return { data: [], error: err.message };
    }
  },
  create: async (payload) => {
    try {
      const res = await fetch(`${API_URL}/services`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      return { data: res.ok ? normalizeId(data) : null, error: res.ok ? null : (data.error || 'Failed to create service') };
    } catch (err) {
      return { data: null, error: err.message };
    }
  },
  update: async (id, payload) => {
    try {
      const res = await fetch(`${API_URL}/services/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      return { data: res.ok ? normalizeId(data) : null, error: res.ok ? null : (data.error || 'Failed to update service') };
    } catch (err) {
      return { data: null, error: err.message };
    }
  },
  remove: async (id) => {
    try {
      const res = await fetch(`${API_URL}/services/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      return { data: res.ok ? data : null, error: res.ok ? null : (data.error || 'Failed to delete service') };
    } catch (err) {
      return { data: null, error: err.message };
    }
  },
};

// Availability Service
export const availabilityService = {
  getByBusiness: async (businessId) => {
    try {
      const res = await fetch(`${API_URL}/availability/business/${businessId}`);
      const data = await res.json();
      return { data: normalizeId(data) || [], error: res.ok ? null : 'Failed to fetch availability' };
    } catch (err) {
      return { data: [], error: err.message };
    }
  },
  getSlots: async (businessId, date, duration = 30) => {
    try {
      const res = await fetch(`${API_URL}/availability/slots?businessId=${encodeURIComponent(businessId)}&date=${encodeURIComponent(date)}&duration=${encodeURIComponent(duration)}`);
      const data = await res.json();
      return { data: res.ok ? data : null, error: res.ok ? null : (data.error || 'Failed to calculate available slots') };
    } catch (err) {
      return { data: null, error: err.message };
    }
  },
  save: async (businessId, payload) => {
    try {
      const res = await fetch(`${API_URL}/availability/business/${businessId}`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      return { data: res.ok ? normalizeId(data) : null, error: res.ok ? null : (data.error || 'Failed to save availability') };
    } catch (err) {
      return { data: null, error: err.message };
    }
  },
};

// Bookings Service
export const bookingService = {
  getByUser: async (userId) => {
    try {
      const res = await fetch(`${API_URL}/bookings/user/${userId}`, { headers: getAuthHeaders() });
      const data = await res.json();
      return { data: normalizeId(data) || [], error: res.ok ? null : 'Failed to fetch bookings' };
    } catch (err) {
      return { data: [], error: err.message };
    }
  },
  getByBusiness: async (businessId) => {
    try {
      const res = await fetch(`${API_URL}/bookings/business/${businessId}`, { headers: getAuthHeaders() });
      const data = await res.json();
      return { data: normalizeId(data) || [], error: res.ok ? null : 'Failed to fetch bookings' };
    } catch (err) {
      return { data: [], error: err.message };
    }
  },
  create: async (payload) => {
    const res = await fetch(`${API_URL}/bookings`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to create booking');
    }
    return { data: normalizeId(data), error: null };
  },
  cancel: async (bookingId, reason = '') => {
    try {
      const res = await fetch(`${API_URL}/bookings/${bookingId}/cancel`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ reason }),
      });
      const data = await res.json();
      return { data: res.ok ? normalizeId(data) : null, error: res.ok ? null : (data.error || 'Failed to cancel booking') };
    } catch (err) {
      return { data: null, error: err.message };
    }
  },
};
