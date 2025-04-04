import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type UserProfile = {
  id: string;
  display_name: string;
  email: string;
};

type UserStore = {
  profile: UserProfile | null;
  token: string | null;
  setProfile: (profile: UserProfile | null) => void;
  login: (token: string) => void;
  logout: () => void;
  _hasHydrated?: boolean;
};

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      profile: null,
      token: null,
      setProfile: (profile) => set({ profile }),
      login: (token) => set({ token }),
      logout: () => set({ profile: null, token: null }),
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
