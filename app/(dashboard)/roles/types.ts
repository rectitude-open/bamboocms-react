import { BaseEntity, CreateEntity, UpdateEntity } from '@/types/BaseEntity';

export interface Role extends BaseEntity {
  name: string;
  description: string;
}

export type CreateRole = CreateEntity<Role>;
export type UpdateRole = UpdateEntity<Role>;
