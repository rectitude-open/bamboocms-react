// components/AuthGuard.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useAuthStore } from '@/stores/auth';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    if (!token) {
      router.replace('/sign-in');
    }
  }, [token, router]);

  return token ? children : null;
}
