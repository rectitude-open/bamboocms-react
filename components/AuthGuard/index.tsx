'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useUserStore, useAuthHydrated } from '@/stores/user';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const token = useUserStore((state) => state.token);
  const isHydrated = useAuthHydrated();

  useEffect(() => {
    if (!isHydrated) return;

    if (!token) {
      router.replace('/sign-in');
    }
  }, [token, isHydrated, router]);

  return token ? children : null;
}
