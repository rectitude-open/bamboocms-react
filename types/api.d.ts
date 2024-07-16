import type { AxiosRequestConfig } from 'axios';

export type FetchFunction = (params: Record<string, unknown>, config?: AxiosRequestConfig) => Promise<any>;
