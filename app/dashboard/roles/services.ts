import { FetchFunction } from '@/types/api';
import axiosInstance from '@/lib/axios';

import { CreateRole, UpdateRole } from './types';

export const fetch: FetchFunction = async (params, config = {}) => {
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

export const view = async (id: number) => {
  const response = await axiosInstance.get(`/admin/administrator-roles/${id}`);
  return response.data;
};

export const update = async (payload: UpdateRole) => {
  const { id, ...data } = payload;
  const response = await axiosInstance.put(`/admin/administrator-roles/${id}`, data);
  return response.data;
};
