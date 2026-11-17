import apiClient, { normalizeId } from './api-client';

export const availabilityService = {
  getByBusiness: async (businessId) => {
    try {
      const res = await apiClient.get(`/availability/business/${businessId}`);
      return { data: normalizeId(res.data) || [], error: null };
    } catch (err) {
      return { data: [], error: err.message };
    }
  },

  getSlots: async (businessId, date, duration = 30) => {
    try {
      const res = await apiClient.get('/availability/slots', {
        params: { businessId, date, duration },
      });
      return { data: res.data, error: null };
    } catch (err) {
      return { data: null, error: err.message };
    }
  },

  save: async (businessId, payload) => {
    try {
      const res = await apiClient.post(`/availability/business/${businessId}`, payload);
      return { data: normalizeId(res.data), error: null };
    } catch (err) {
      return { data: null, error: err.message };
    }
  },
};

export default availabilityService;
