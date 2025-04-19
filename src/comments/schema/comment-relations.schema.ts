import { articles } from '@articles/schema';
import { users } from '@users/users.model';
import { relations } from 'drizzle-orm';
import { comments } from './comments.schema';

export const commentRelations = relations(comments, ({ one }) => ({
  article: one(articles, {
    fields: [comments.articleId],
    references: [articles.id],
    relationName: 'articleComments',
  }),
  author: one(users, {
    fields: [comments.authorId],
    references: [users.id],
    relationName: 'commentAuthor',
  }),
}));
