import type { AxiosRequestConfig } from 'axios';

export interface ApiResponse {
  success: boolean;
  data: Record<string, unknown> | Record<string, unknown>[];
  meta?: {
    total: number;
    current_page: number;
    per_page: number;
  };
}

export type FetchFunction = (params: Record<string, unknown>, config?: AxiosRequestConfig) => Promise<any>;
