import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import type { users } from '../users.schema';

/**
 * Database row type for a user
 */
export type UserRow = InferSelectModel<typeof users>;
export type NewUserRow = InferInsertModel<typeof users>;
export type UpdateUserRow = Partial<
  Omit<UserRow, 'id' | 'createdAt' | 'updatedAt'>
>;
