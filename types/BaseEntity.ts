export interface BaseEntity {
  id: number;
  created_at: string;
  updated_at: string;
}

export type RequireOnly<T, K extends keyof T> = Partial<T> & Pick<T, K>;

export type CreateEntity<T extends BaseEntity> = Partial<Omit<T, keyof BaseEntity>>;
export type UpdateEntity<T extends BaseEntity> = RequireOnly<T, 'id'>;
