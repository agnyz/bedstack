import { users } from '@users/users.model';
import { sql } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { articles } from '../../articles/schema';

export const comments = pgTable('comments', {
  id: serial('id').primaryKey().notNull(),
  body: text('body').notNull(),
  articleId: integer('article_id')
    .references(() => articles.id, { onDelete: 'cascade' })
    .notNull(),
  authorId: integer('author_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
});
