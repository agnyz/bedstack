import { articles } from '@/articles/articles.schema';
import { relations } from 'drizzle-orm';
import {
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
import { createSelectSchema } from 'drizzle-typebox';

export const tags = pgTable('tags', {
  name: text('name').primaryKey(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const tagRelations = relations(tags, ({ many }) => ({
  articles: many(articleTags, {
    relationName: 'articlesWithTag',
  }),
}));

export const articleTags = pgTable(
  'article_tags',
  {
    articleId: integer('article_id')
      .references(() => articles.id, { onDelete: 'cascade' })
      .notNull(),
    tagName: text('tag_name')
      .references(() => tags.name, { onDelete: 'cascade' })
      .notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [primaryKey({ columns: [table.articleId, table.tagName] })],
);

export const articleTagsRelations = relations(articleTags, ({ one }) => ({
  article: one(articles, {
    fields: [articleTags.articleId],
    references: [articles.id],
    relationName: 'articleTags',
  }),
  tag: one(tags, {
    fields: [articleTags.tagName],
    references: [tags.name],
    relationName: 'articlesWithTag',
  }),
}));

export const tagsSelectSchema = createSelectSchema(tags);
