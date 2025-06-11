// Do not use path aliases here (i.e. '@/users/users.model'), as that doesn't work with Drizzle Studio
import { type userFollows, users } from '@/users/users.schema';
import { Type } from '@sinclair/typebox';
import type { InferSelectModel } from 'drizzle-orm';
import { createSelectSchema } from 'drizzle-typebox';

// Schema for selecting a user - can be used to validate API responses
export const selectUserSchemaRaw = createSelectSchema(users);
export const SelectUserSchema = Type.Omit(selectUserSchemaRaw, ['password']);

export type FollowerSchema = InferSelectModel<typeof userFollows>;
