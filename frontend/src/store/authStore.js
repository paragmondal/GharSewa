import { create } from 'zustand';
import { authAPI } from '../api';

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  login: (user, accessToken, refreshToken) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    set({ user, isAuthenticated: true });
  },

  logout: async () => {
    try { await authAPI.logout(); } catch {}
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    set({ user: null, isAuthenticated: false });
  },

  setUser: (user) => set({ user, isAuthenticated: true }),
  setLoading: (isLoading) => set({ isLoading }),

  initialize: async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      set({ isLoading: false });
      return;
    }
    try {
      const { data } = await authAPI.getMe();
      set({ user: data.data.user, isAuthenticated: true, isLoading: false });
    } catch {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));

export default useAuthStore;
