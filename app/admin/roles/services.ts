import { FetchService, UpdateService, ViewService } from '@/types/api';
import axiosInstance from '@/lib/axios';

import { CreateRole, UpdateRole } from './types';

export const fetch: FetchService = async (params, config = {}) => {
  const { data } = await axiosInstance.get(`/admin/administrator-roles`, {
    ...config,
    params,
  });
  return data;
};

export const create = async (data: CreateRole = {}) => {
  const response = await axiosInstance.post(`/admin/administrator-roles`, data);
  return response.data;
};

export const view: ViewService = async (data) => {
  const response = await axiosInstance.get(`/admin/administrator-roles/${data.id}`);
  return response.data;
};

export const update: UpdateService<UpdateRole> = async (data, params) => {
  if (params.id) {
    const response = await axiosInstance.put(`/admin/administrator-roles/${params.id}`, data);
    return response.data;
  } else {
    throw new Error('Missing required params');
  }
};

export const destroy = async (id: number) => {
  const response = await axiosInstance.delete(`/admin/administrator-roles/${id}`);
  return response.data;
};

export const bulkDestroy = async (ids: number[]) => {
  const response = await axiosInstance.post(`/admin/administrator-roles/bulk`, { ids, _method: 'DELETE' });
  return response.data;
};
