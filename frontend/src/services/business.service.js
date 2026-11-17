import apiClient, { normalizeId } from './api-client';

export const businessService = {
  getAll: async () => {
    try {
      const res = await apiClient.get('/businesses');
      return { data: normalizeId(res.data) || [], error: null };
    } catch (err) {
      return { data: [], error: err.message };
    }
  },

  getById: async (id) => {
    try {
      const res = await apiClient.get(`/businesses/${id}`);
      return { data: normalizeId(res.data), error: null };
    } catch (err) {
      return { data: null, error: err.message };
    }
  },

  getMyBusiness: async () => {
    try {
      const res = await apiClient.get('/businesses/me');
      return { data: normalizeId(res.data), error: null };
    } catch (err) {
      return { data: null, error: err.message };
    }
  },

  getMyBusinesses: async () => {
    try {
      const res = await apiClient.get('/businesses/my/all');
      return { data: normalizeId(res.data) || [], error: null };
    } catch (err) {
      return { data: [], error: err.message };
    }
  },

  create: async (payload) => {
    try {
      const res = await apiClient.post('/businesses', payload);
      return { data: normalizeId(res.data), error: null };
    } catch (err) {
      return { data: null, error: err.message };
    }
  },

  update: async (id, payload) => {
    try {
      const res = await apiClient.put(`/businesses/${id}`, payload);
      return { data: normalizeId(res.data), error: null };
    } catch (err) {
      return { data: null, error: err.message };
    }
  },

  delete: async (id) => {
    try {
      const res = await apiClient.delete(`/businesses/${id}`);
      return { data: res.data, error: null };
    } catch (err) {
      return { data: null, error: err.message };
    }
  },
};

export default businessService;
