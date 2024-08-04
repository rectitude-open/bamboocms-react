'use client';

import * as React from 'react';
import type { Viewport } from 'next';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

import '@/styles/global.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { SnackbarProvider } from 'notistack';

import { LocalizationProvider } from '../components/core/localization-provider';
import { ThemeProvider } from '../components/core/theme-provider/theme-provider';
import { UserProvider } from '../contexts/user-context';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 1000,
      gcTime: 300000,
    },
  },
});

export const viewport = { width: 'device-width', initialScale: 1 } satisfies Viewport;

interface LayoutProps {
  children: React.ReactNode;
}

dayjs.extend(utc);
dayjs.extend(timezone);
const browserTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
const browserLocale = Intl.DateTimeFormat().resolvedOptions().locale;
dayjs.tz.setDefault(browserTimeZone);
dayjs.locale(browserLocale);

export default function Layout({ children }: LayoutProps): React.JSX.Element {
  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools initialIsOpen={false} />
          <LocalizationProvider>
            <UserProvider>
              <SnackbarProvider
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
              >
                <ThemeProvider>{children}</ThemeProvider>
              </SnackbarProvider>
            </UserProvider>
          </LocalizationProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
