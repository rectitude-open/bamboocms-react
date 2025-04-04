'use client';

import { useTheme } from '@mui/material/styles';
import { useMutation } from '@tanstack/react-query';
import { AppProvider as ToolPadAppProvider } from '@toolpad/core/AppProvider';
import { AuthResponse, SignInPage, type AuthProvider } from '@toolpad/core/SignInPage';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';
import * as React from 'react';

import { useUserStore } from '@/stores/user';

const providers = [{ id: 'credentials', name: 'Credentials' }];

export default function BrandingSignInPage() {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const login = useUserStore((state) => state.login);
  const setProfile = useUserStore((state) => state.setProfile);

  const loginMutation = useMutation({
    mutationFn: (credentials: { email: string; password: string }) =>
      axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`, credentials, {
        headers: {
          'Content-Type': 'application/json',
        },
      }),
  });

  const signIn = async (provider: AuthProvider, formData?: any, callbackUrl?: string) => {
    if (provider.id === 'credentials' && formData) {
      const email = formData.get('email') || '';
      const password = formData.get('password') || '';
      try {
        const response = await loginMutation.mutateAsync({ email, password });
        const { token, user, message } = response?.data?.data ?? {};

        if (token && user) {
          setProfile({
            id: user.id,
            display_name: user.display_name,
            email: user.email,
          });
          login(token);
          enqueueSnackbar('Sign-in successful. Redirecting...', { variant: 'success' });
          router.push(callbackUrl || '/');
          return { success: 'Sign-in successful. Redirecting...' } as AuthResponse;
        } else {
          return {
            error: message || 'Sign-in failed',
            type: 'error',
          } as AuthResponse;
        }
      } catch (error: any) {
        return {
          error: error.response?.data?.message || 'Sign-in failed',
          type: 'error',
        } as AuthResponse;
      }
    }

    return {
      error: 'Invalid provider',
      type: 'error',
    } as AuthResponse;
  };

  const theme = useTheme();
  return (
    <ToolPadAppProvider theme={theme}>
      <SignInPage
        signIn={signIn}
        providers={providers}
        slots={{
          subtitle: () => <div>Welcome to BambooCMS</div>,
        }}
        slotProps={{ emailField: { autoFocus: true } }}
      />
    </ToolPadAppProvider>
  );
}
