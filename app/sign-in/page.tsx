'use client';

import { useTheme } from '@mui/material/styles';
import { useMutation } from '@tanstack/react-query';
import { AppProvider as ToolPadAppProvider } from '@toolpad/core/AppProvider';
import { AuthResponse, SignInPage, type AuthProvider } from '@toolpad/core/SignInPage';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSnackbar } from 'notistack';
import * as React from 'react';
import { useShallow } from 'zustand/react/shallow';

import { authService } from '@/services/auth';
import { useUserStore } from '@/stores/user';

const providers = [{ id: 'credentials', name: 'Credentials' }];

export default function BrandingSignInPage() {
  const searchParams = useSearchParams();
  const redirect = decodeURIComponent(searchParams.get('redirect') || '/');

  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const { login, setProfile } = useUserStore(
    useShallow((state) => ({
      login: state.login,
      setProfile: state.setProfile,
    }))
  );

  const loginMutation = useMutation({ mutationFn: authService.login });

  const signIn = React.useCallback(
    async (provider: AuthProvider, formData?: any) => {
      if (provider.id === 'credentials' && formData) {
        const email = formData.get('email') ?? '';
        const password = formData.get('password') ?? '';
        const remember = formData.get('remember') ?? false;

        try {
          const response = await loginMutation.mutateAsync({ email, password, remember });
          const { token, user, message } = response?.data?.data ?? {};

          if (token && user) {
            setProfile({
              id: user.id,
              display_name: user.display_name,
              email: user.email,
            });
            login(token);
            enqueueSnackbar('Sign-in successful. Redirecting...', { variant: 'success' });
            router.replace(redirect);
            return { success: 'Sign-in successful. Redirecting...' } as AuthResponse;
          } else {
            return {
              error: message ?? 'Sign-in failed',
              type: 'error',
            } as AuthResponse;
          }
        } catch (error: any) {
          return {
            error: error.response?.data?.message ?? 'Sign-in failed',
            type: 'error',
          } as AuthResponse;
        }
      }

      return {
        error: 'Invalid provider',
        type: 'error',
      } as AuthResponse;
    },

    [loginMutation, login, router, setProfile, enqueueSnackbar, redirect]
  );

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
