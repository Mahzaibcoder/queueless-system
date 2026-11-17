import apiClient, { normalizeId } from './api-client';

export const serviceService = {
  getByBusiness: async (businessId) => {
    try {
      const res = await apiClient.get(`/services/business/${businessId}`);
      return { data: normalizeId(res.data) || [], error: null };
    } catch (err) {
      return { data: [], error: err.message };
    }
  },

  create: async (payload) => {
    try {
      const res = await apiClient.post('/services', payload);
      return { data: normalizeId(res.data), error: null };
    } catch (err) {
      return { data: null, error: err.message };
    }
  },

  update: async (id, payload) => {
    try {
      const res = await apiClient.put(`/services/${id}`, payload);
      return { data: normalizeId(res.data), error: null };
    } catch (err) {
      return { data: null, error: err.message };
    }
  },

  remove: async (id) => {
    try {
      const res = await apiClient.delete(`/services/${id}`);
      return { data: res.data, error: null };
    } catch (err) {
      return { data: null, error: err.message };
    }
  },
};

export default serviceService;
