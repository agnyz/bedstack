import { type Static, Type } from '@sinclair/typebox';
// Do not use path aliases here (i.e. '@/users/users.model'), as that doesn't work with Drizzle Studio
import { type userFollows, users } from '@users/users.model';
import type { InferSelectModel } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-typebox';

// Schema for inserting a user - can be used to validate API requests
export const insertUserSchemaRaw = createInsertSchema(users);
export const InsertUserSchema = Type.Object({
  user: Type.Omit(insertUserSchemaRaw, [
    'id',
    'createdAt',
    'updatedAt',
    'bio',
    'image',
  ]),
});

export const UpdateUserSchema = Type.Object({
  user: Type.Partial(
    Type.Omit(insertUserSchemaRaw, ['id', 'createdAt', 'updatedAt']),
  ),
});

export const ReturnedUserSchema = Type.Object({
  user: Type.Composite([
    Type.Omit(insertUserSchemaRaw, [
      'id',
      'password',
      'createdAt',
      'updatedAt',
    ]),
    Type.Object({ token: Type.String() }),
  ]),
});

export type UserToCreate = Static<typeof InsertUserSchema>['user'];
export type UserToUpdate = Static<typeof UpdateUserSchema>['user'];
export type UserInDb = typeof users.$inferSelect;
export type User = Omit<UserInDb, 'password'>;

export const UserLoginSchema = Type.Object({
  user: Type.Object({
    email: Type.String(),
    password: Type.String(),
  }),
});

// Schema for selecting a user - can be used to validate API responses
export const selectUserSchemaRaw = createSelectSchema(users);
export const SelectUserSchema = Type.Omit(selectUserSchemaRaw, ['password']);

export type FollowerSchema = InferSelectModel<typeof userFollows>;
