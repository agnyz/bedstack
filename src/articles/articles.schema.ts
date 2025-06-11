import { users } from '@/users/users.schema';
import { comments } from '@comments/comments.schema';
import { articleTags } from '@tags/tags.schema';
import { relations } from 'drizzle-orm';
import {
  integer,
  primaryKey,
  serial,
  pgTable as table,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

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

export const favoriteArticles = table(
  'favorite_articles',
  {
    articleId: integer('article_id')
      .references(() => articles.id, { onDelete: 'cascade' })
      .notNull(),
    userId: integer('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [primaryKey({ columns: [table.articleId, table.userId] })],
);

export const articleRelations = relations(articles, ({ one, many }) => ({
  author: one(users, {
    fields: [articles.authorId],
    references: [users.id],
    relationName: 'author',
  }),
  favoritedBy: many(favoriteArticles, {
    relationName: 'favoriteArticle',
  }),
  comments: many(comments, {
    relationName: 'articleComments',
  }),
  tags: many(articleTags, {
    relationName: 'articleTags',
  }),
}));

export const favoriteArticleRelations = relations(
  favoriteArticles,
  ({ one }) => ({
    article: one(articles, {
      fields: [favoriteArticles.articleId],
      references: [articles.id],
      relationName: 'favoriteArticle',
    }),
    user: one(users, {
      fields: [favoriteArticles.userId],
      references: [users.id],
      relationName: 'favoritedBy',
    }),
  }),
);
