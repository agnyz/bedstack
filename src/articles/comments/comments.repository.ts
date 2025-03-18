import { and, desc, eq } from 'drizzle-orm';

import type { Database } from '@/database.providers';
import { articles, comments } from '@articles/articles.model';
import type { CommentToCreate } from './comments.schema';

export class CommentsRepository {
  constructor(private readonly db: Database) {}

  async create(commentData: CommentToCreate) {
    const [comment] = await this.db
      .insert(comments)
      .values(commentData)
      .returning();
    return comment;
  }

  async findById(id: number) {
    const result = await this.db.query.comments.findFirst({
      where: eq(comments.id, id),
    });
    return result;
  }

  async findManyByArticleId(articleId: number) {
    const result = await this.db.query.comments.findMany({
      where: eq(comments.articleId, articleId),
      orderBy: [desc(comments.createdAt)],
    });
    return result;
  }

  async findBySlug(slug: string) {
    const result = await this.db.query.articles.findFirst({
      where: eq(articles.slug, slug),
    });

    return result;
  }

  async delete(commentId: number, authorId: number) {
    return await this.db
      .delete(comments)
      .where(and(eq(comments.id, commentId), eq(comments.authorId, authorId)));
  }
}
