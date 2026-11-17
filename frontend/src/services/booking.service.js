import apiClient, { normalizeId } from './api-client';

export const bookingService = {
  getByUser: async (userId) => {
    try {
      const res = await apiClient.get(`/bookings/user/${userId}`);
      return { data: normalizeId(res.data) || [], error: null };
    } catch (err) {
      return { data: [], error: err.message };
    }
  },

  getByBusiness: async (businessId) => {
    try {
      const res = await apiClient.get(`/bookings/business/${businessId}`);
      return { data: normalizeId(res.data) || [], error: null };
    } catch (err) {
      return { data: [], error: err.message };
    }
  },

  create: async (payload) => {
    try {
      const res = await apiClient.post('/bookings', payload);
      return { data: normalizeId(res.data), error: null };
    } catch (err) {
      throw err;
    }
  },

  cancel: async (bookingId, reason = '') => {
    try {
      const res = await apiClient.put(`/bookings/${bookingId}/cancel`, { reason });
      return { data: normalizeId(res.data), error: null };
    } catch (err) {
      return { data: null, error: err.message };
    }
  },
};

export default bookingService;
