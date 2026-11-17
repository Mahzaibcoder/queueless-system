import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach token from local session if available
apiClient.interceptors.request.use(
  (config) => {
    try {
      const session = localStorage.getItem('queueless_auth_session');
      if (session) {
        const user = JSON.parse(session);
        if (user?.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      }
    } catch (e) {
      // ignore JSON parse error
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: extract response data or format errors cleanly
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Standardize error message
    const message = error.response?.data?.error || error.response?.data?.message || error.message || 'API request failed';
    return Promise.reject(new Error(message));
  }
);

// Helper to normalize MongoDB _id to id
export const normalizeId = (item) => {
  if (!item) return item;
  if (Array.isArray(item)) return item.map(normalizeId);
  return {
    ...item,
    id: item.id || item._id,
  };
};

export default apiClient;
