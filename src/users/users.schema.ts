import { articles, favoriteArticles } from '@/articles/articles.schema';
import { relations, sql } from 'drizzle-orm';
import {
  date,
  integer,
  pgTable,
  primaryKey,
  serial,
  text,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey().notNull(),
  email: text('email').notNull().unique(),
  bio: text('bio').default('').notNull(),
  image: text('image')
    .default('https://api.realworld.io/images/smiley-cyrus.jpg')
    .notNull(),
  password: text('password').notNull(),
  username: text('username').notNull().unique(),
  createdAt: date('created_at').default(sql`CURRENT_DATE`).notNull(),
  updatedAt: date('updated_at').default(sql`CURRENT_DATE`).notNull(),
});

export const userRelations = relations(users, ({ many }) => ({
  followers: many(userFollows, { relationName: 'followed' }),
  following: many(userFollows, { relationName: 'follower' }),
  publishedArticles: many(articles, { relationName: 'author' }),
  favoriteArticles: many(favoriteArticles, { relationName: 'favoritedBy' }),
}));

export const userFollows = pgTable(
  'user_follows',
  {
    followedId: integer('followed_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    followerId: integer('follower_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    createdAt: date('created_at').default(sql`CURRENT_DATE`).notNull(),
    updatedAt: date('updated_at').default(sql`CURRENT_DATE`).notNull(),
  },
  (table) => [primaryKey({ columns: [table.followedId, table.followerId] })],
);

export const userFollowsRelations = relations(userFollows, ({ one }) => ({
  follower: one(users, {
    fields: [userFollows.followerId],
    references: [users.id],
    relationName: 'follower',
  }),
  followed: one(users, {
    fields: [userFollows.followedId],
    references: [users.id],
    relationName: 'followed',
  }),
}));
