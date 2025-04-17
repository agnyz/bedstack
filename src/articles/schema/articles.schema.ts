import {
  integer,
  pgTable as table,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
import { users } from '@/users/users.model';

export const articles = table('articles', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  body: text('body').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  authorId: integer('author_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
});
