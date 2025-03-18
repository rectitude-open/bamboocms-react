import axiosInstance from '@/lib/axios';
import type { FetchService, UpdateService, ViewService } from '@/types/api';

import type { CreateRole, UpdateRole } from './types';

export const fetch: FetchService = async (params, config = {}) => {
  const { data } = await axiosInstance.get(`/roles`, {
    ...config,
    params,
  });
  return data;
};

export const create = async (data: CreateRole = {}) => {
  const response = await axiosInstance.post(`/roles`, data);
  return response.data;
};

export const view: ViewService = async (data) => {
  const response = await axiosInstance.get(`/roles/${data.id}`);
  return response.data;
};

export const update: UpdateService<UpdateRole> = async (data, params) => {
  if (params.id) {
    const response = await axiosInstance.put(`/roles/${params.id}`, data);
    return response.data;
  } else {
    throw new Error('Missing required params');
  }
};

export const destroy = async (id: number) => {
  const response = await axiosInstance.delete(`/roles/${id}`);
  return response.data;
};

export const bulkDestroy = async (ids: number[]) => {
  const response = await axiosInstance.post(`/roles/bulk`, { ids, _method: 'DELETE' });
  return response.data;
};
