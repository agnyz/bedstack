import { relations, sql } from 'drizzle-orm';
import {
  date,
  integer,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

import { users } from '@users/users.model';

export const articles = pgTable('articles', {
  id: serial('id').primaryKey().notNull(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  body: text('body').notNull(),
  tagList: text('tag_list').array().default(sql`'{}'::text[]`).notNull(),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`).notNull(),
  authorId: integer('author_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
});

export const articleRelations = relations(articles, ({ one, many }) => ({
  author: one(users, {
    fields: [articles.authorId],
    references: [users.id],
    relationName: 'author',
  }),
  favoritedBy: many(favoriteArticles, {
    relationName: 'favoriteArticle',
  }),
}));

export const favoriteArticles = pgTable(
  'favorite_articles',
  {
    articleId: integer('article_id')
      .references(() => articles.id, { onDelete: 'cascade' })
      .notNull(),
    userId: integer('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    createdAt: date('created_at').default(sql`CURRENT_DATE`).notNull(),
    updatedAt: date('updated_at').default(sql`CURRENT_DATE`).notNull(),
  },
  (table) => [primaryKey({ columns: [table.articleId, table.userId] })],
);

export const favoriteArticleRelations = relations(
  favoriteArticles,
  ({ one }) => ({
    article: one(articles, {
      fields: [favoriteArticles.articleId],
      references: [articles.id],
      relationName: 'favoriteArticle',
    }),
    users: one(users, {
      fields: [favoriteArticles.userId],
      references: [users.id],
      relationName: 'favoritedBy',
    }),
  }),
);
