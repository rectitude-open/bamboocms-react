import type { AxiosRequestConfig } from 'axios';

export interface ApiResponse<T = Record<string, unknown> | Record<string, unknown>[]> {
  success: boolean;
  data: T | T[];
  meta?: {
    total: number;
    current_page: number;
    per_page: number;
  };
}

export type FetchService = (params: Record<string, unknown>, config?: AxiosRequestConfig) => Promise<any>;
export type UpdateService<T = Record<string, unknown>> = (data: T, params: Record<string, unknown>) => Promise<any>;
export type ViewService = (data: { id: number; [key: string]: unknown }) => Promise<any>;
