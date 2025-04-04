import axios from 'axios';

import type { LoginResponse } from '@/types/auth';

export const authService = {
  login: (credentials: { email: string; password: string }) =>
    axios.post<{ data: LoginResponse }>(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`, credentials, {
      headers: {
        'Content-Type': 'application/json',
      },
    }),
};
