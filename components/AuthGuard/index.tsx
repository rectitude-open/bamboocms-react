'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { authService } from '@/services/auth';
import { useUserStore, useAuthHydrated } from '@/stores/user';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { token, logout, profile, setProfile } = useUserStore(
    useShallow((state) => ({
      token: state.token,
      logout: state.logout,
      profile: state.profile,
      setProfile: state.setProfile,
    }))
  );

  const isHydrated = useAuthHydrated();
  const [isErrorHandled, setIsErrorHandled] = useState(false);

  const handleLogout = () => {
    const redirect = encodeURIComponent(window.location.pathname + window.location.search);
    logout();
    setProfile(null);
    router.replace(`/sign-in?redirect=${redirect}`);
  };

  const { mutate } = useMutation({
    mutationFn: authService.getProfile,
    onSuccess: (response) => {
      const { user } = response?.data?.data ?? {};
      if (!user) {
        handleLogout();
        return;
      }

      setProfile({
        id: user.id,
        display_name: user.display_name,
        email: user.email,
      });
    },
    onError: (error) => {
      handleLogout();
      setIsErrorHandled(true);
    },
  });

  useEffect(() => {
    if (!isHydrated || isErrorHandled) return;

    if (!token && !window.location.pathname.startsWith('/sign-in')) {
      router.replace('/sign-in');
      return;
    }

    if (!profile) {
      mutate();
    }
  }, [token, isErrorHandled, isHydrated, router, profile, mutate]);

  return token ? children : null;
}
