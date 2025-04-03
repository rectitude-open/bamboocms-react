'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useAuthStore, useAuthHydrated } from '@/stores/auth';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const isHydrated = useAuthHydrated();

  useEffect(() => {
    if (!isHydrated) return;

    if (!token) {
      router.replace('/sign-in');
    }
  }, [token, isHydrated, router]);

  return token ? children : null;
}
