import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AuthStore = {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  _hasHydrated?: boolean;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      login: (token) => set({ token }),
      logout: () => set({ token: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state._hasHydrated = true;
        }
      },
    }
  )
);

export const useAuthHydrated = () => useAuthStore((state: any) => state._hasHydrated === true);
