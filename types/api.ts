import type { AxiosRequestConfig } from 'axios';

export interface ApiResponse<T = Record<string, unknown> | Record<string, unknown>[]> {
  success: boolean;
  data: T;
  meta?: {
    total: number;
    current_page: number;
    per_page: number;
  };
}

export type FetchFunction = (params: Record<string, unknown>, config?: AxiosRequestConfig) => Promise<any>;
export type UpdateFunction = (payload: Record<string, unknown>) => Promise<any>;
