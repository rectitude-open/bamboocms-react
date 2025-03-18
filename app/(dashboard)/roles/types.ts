import { BaseEntity, CreateEntity, UpdateEntity } from '@/types/BaseEntity';

export interface Role extends BaseEntity {
  label: string;
  created_at: string;
  status: string;
}

export type CreateRole = CreateEntity<Role>;
export type UpdateRole = UpdateEntity<Role>;
