import apiClient, { normalizeId } from './api-client';

export const authService = {
  login: async (email, password) => {
    try {
      const res = await apiClient.post('/auth/login', { email, password });
      const normalizedUser = normalizeId(res.data.user || res.data);
      localStorage.setItem('queueless_auth_session', JSON.stringify(normalizedUser));
      return { user: normalizedUser, error: null };
    } catch (err) {
      return { user: null, error: err.message };
    }
  },

  register: async (userData) => {
    try {
      const res = await apiClient.post('/auth/register', userData);
      const normalizedUser = normalizeId(res.data.user || res.data);
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

export default authService;
