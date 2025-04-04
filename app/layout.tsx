'use client';

import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import LinearProgress from '@mui/material/LinearProgress';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { NextAppProvider } from '@toolpad/core/nextjs';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { SnackbarProvider } from 'notistack';
import * as React from 'react';

import theme from '../theme';

import type { Navigation } from '@toolpad/core/AppProvider';

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

dayjs.extend(utc);
dayjs.extend(timezone);
const browserTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
const browserLocale = Intl.DateTimeFormat().resolvedOptions().locale;
dayjs.tz.setDefault(browserTimeZone);
dayjs.locale(browserLocale);

const NAVIGATION: Navigation = [
  {
    kind: 'header',
    title: 'Main items',
  },
  {
    segment: '',
    title: 'Dashboard',
    icon: <DashboardIcon />,
  },
  {
    segment: 'roles',
    title: 'Roles',
    icon: <PeopleIcon />,
  },
];

const BRANDING = {
  title: 'BambooCMS',
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang='en' data-toolpad-color-scheme='light' suppressHydrationWarning>
      <body>
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <React.Suspense fallback={<LinearProgress />}>
            <QueryClientProvider client={queryClient}>
              <ReactQueryDevtools initialIsOpen={false} />
              <SnackbarProvider
                autoHideDuration={3000}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <NextAppProvider navigation={NAVIGATION} branding={BRANDING} theme={theme}>
                    {props.children}
                  </NextAppProvider>
                </LocalizationProvider>
              </SnackbarProvider>
            </QueryClientProvider>
          </React.Suspense>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
