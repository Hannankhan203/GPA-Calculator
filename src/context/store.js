import { create } from "zustand";

export const useAuthStore = (set) => ({
  user: null,
  loading: true,
  error: null,
  setUser: (user) => set({ user, loading: false }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  logout: () => set({ user: null, loading: false, error: null }),
});
