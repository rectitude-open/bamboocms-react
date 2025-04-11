import axiosInstance from '@/lib/axios';
import type { FetchService, UpdateService, ViewService } from '@/types/api';

import type { CreateUser, UpdateUser } from './types';

export const fetch: FetchService = async (params, config = {}) => {
  const { data } = await axiosInstance.get(`/users`, {
    ...config,
    params,
  });
  return data;
};

export const create = async (data: CreateUser = {}) => {
  const response = await axiosInstance.post(`/users`, data);
  return response.data;
};

export const view: ViewService = async (data) => {
  const response = await axiosInstance.get(`/users/${data.id}`);
  return response.data;
};

export const update: UpdateService<UpdateUser> = async (data, params) => {
  if (params.id) {
    const response = await axiosInstance.put(`/users/${params.id}`, data);
    return response.data;
  } else {
    throw new Error('Missing required params');
  }
};

export const destroy = async (id: number) => {
  const response = await axiosInstance.delete(`/users/${id}`);
  return response.data;
};

export const bulkDestroy = async (ids: number[]) => {
  const response = await axiosInstance.post(`/users/bulk`, { ids, _method: 'DELETE' });
  return response.data;
};
