import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type UserStore = {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  _hasHydrated?: boolean;
};

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      token: null,
      login: (token) => set({ token }),
      logout: () => set({ token: null }),
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({ token: state.token }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state._hasHydrated = true;
        }
      },
    }
  )
);

export const useAuthHydrated = () => useUserStore((state: any) => state._hasHydrated === true);
