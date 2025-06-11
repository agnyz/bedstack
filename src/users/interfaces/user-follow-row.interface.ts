import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import type { userFollows } from '../users.schema';

/**
 * Database row type for a user follow relationship
 */
export type UserFollowRow = InferSelectModel<typeof userFollows>;
export type NewUserFollowRow = InferInsertModel<typeof userFollows>;
