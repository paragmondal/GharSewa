import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// ─── Request interceptor — attach access token ──────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response interceptor — auto-refresh access token ──────────
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');

      if (refreshToken) {
        try {
          const { data } = await axios.post(`${API_URL}/auth/refresh-token`, { refreshToken });
          const newToken = data.data.accessToken;
          localStorage.setItem('accessToken', newToken);
          original.headers.Authorization = `Bearer ${newToken}`;
          return api(original);
        } catch {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// ─── Named API modules ─────────────────────────────────────────

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
};

export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
};

export const providerAPI = {
  createProfile: (data) => api.post('/providers/profile', data),
  getMyProfile: () => api.get('/providers/profile/me'),
  updateProfile: (data) => api.put('/providers/profile', data),
  toggleAvailability: () => api.patch('/providers/availability'),
  search: (params) => api.get('/providers/search', { params }),
  getById: (id) => api.get(`/providers/${id}`),
};

export const serviceAPI = {
  getAll: () => api.get('/services'),
  getById: (id) => api.get(`/services/${id}`),
  getByCategory: (cat) => api.get(`/services/category/${cat}`),
};

export const bookingAPI = {
  create: (data) => api.post('/bookings', data),
  getMyBookings: (params) => api.get('/bookings/my', { params }),
  getById: (id) => api.get(`/bookings/${id}`),
  cancel: (id, reason) => api.delete(`/bookings/${id}/cancel`, { data: { reason } }),
  getProviderBookings: (params) => api.get('/bookings/provider', { params }),
  updateStatus: (id, status, note) => api.patch(`/bookings/${id}/status`, { status, note }),
};

export const reviewAPI = {
  create: (data) => api.post('/reviews', data),
  getByProvider: (providerId, params) => api.get(`/reviews/provider/${providerId}`, { params }),
};

export const paymentAPI = {
  createOrder: (bookingId) => api.post('/payments/create-order', { bookingId }),
  verify: (data) => api.post('/payments/verify', data),
};

export const aiAPI = {
  chat: (messages) => api.post('/ai/chat', { messages }),
};

export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: (params) => api.get('/admin/users', { params }),
  toggleUserStatus: (userId) => api.patch(`/admin/users/${userId}/status`),
  getProviders: (params) => api.get('/admin/providers', { params }),
  approveProvider: (id) => api.patch(`/admin/providers/${id}/approve`),
  getBookings: (params) => api.get('/admin/bookings', { params }),
};
