import { FetchFunction } from '@/types/api';
import axiosInstance from '@/lib/axios';

export const fetch: FetchFunction = async (params, config = {}) => {
  const { data } = await axiosInstance.get(`/admin/administrator-roles`, {
    ...config,
    params,
  });
  return data;
};

export const create = async (data: Record<string, unknown> = {}) => {
  const response = await axiosInstance.post(`/admin/administrator-roles`, data);
  return response.data;
};
