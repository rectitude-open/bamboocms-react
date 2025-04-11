import { BaseEntity, CreateEntity, UpdateEntity } from '@/types/BaseEntity';

export interface User extends BaseEntity {
  email: string;
  display_name: string;
  status: string;
  created_at: string;
}

export type CreateUser = CreateEntity<User>;
export type UpdateUser = UpdateEntity<User>;
