'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { authService } from '@/services/auth';
import { useUserStore, useAuthHydrated } from '@/stores/user';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const token = useUserStore((state) => state.token);
  const profile = useUserStore.getState().profile;
  const setProfile = useUserStore((state) => state.setProfile);
  const logout = useUserStore((state) => state.logout);
  const isHydrated = useAuthHydrated();
  const [isErrorHandled, setIsErrorHandled] = useState(false);

  const handleLogout = () => {
    logout();
    setProfile(null);
    router.replace('/sign-in');
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

    if (!token) {
      router.replace('/sign-in');
    }

    if (!profile) {
      mutate();
    }
  }, [token, isErrorHandled, isHydrated, router, profile, mutate]);

  return token ? children : null;
}
