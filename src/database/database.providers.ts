import * as articlesSchema from '@/articles/articles.schema';
import * as commentsSchema from '@/comments/comments.schema';
import * as tagsSchema from '@/tags/tags.schema';
import * as usersSchema from '@/users/users.schema';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { dbCredentialsString } from '../../drizzle.config';

export const migrationsClient = postgres(dbCredentialsString, { max: 1 });

export const queryClient = postgres(dbCredentialsString);

export const db = drizzle(queryClient, {
  schema: {
    ...usersSchema,
    ...articlesSchema,
    ...tagsSchema,
    ...commentsSchema,
  },
  logger: true,
});
export type Database = typeof db;
