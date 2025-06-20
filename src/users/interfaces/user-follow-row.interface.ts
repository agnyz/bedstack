import type { InferNewRow } from '@/common/interfaces';
import type { InferSelectModel } from 'drizzle-orm';
import type { userFollows } from '../users.schema';

/**
 * Database row type for a user follow relationship
 */
export type UserFollowRow = InferSelectModel<typeof userFollows>;
export type NewUserFollowRow = InferNewRow<typeof userFollows>;
