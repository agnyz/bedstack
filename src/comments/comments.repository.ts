import type { Database } from '@/database.providers';
import { articles } from '@articles/articles.schema';
import type { ArticleRow } from '@articles/interfaces/article-row.interface';
import { and, desc, eq } from 'drizzle-orm';
import { comments } from './comments.schema';
import type { NewCommentRow } from './interfaces';

export class CommentsRepository {
  constructor(private readonly db: Database) {}

  async create(commentData: NewCommentRow) {
    const [comment] = await this.db
      .insert(comments)
      .values(commentData)
      .returning();
    return comment;
  }

  /**
   * Find a comment by its id
   * @param id - The id of the comment
   * @returns The comment
   */
  async findById(id: number) {
    const result = await this.db.query.comments.findFirst({
      where: eq(comments.id, id),
    });
    return result;
  }

  /**
   * Find all comments by article id
   *
   * Note: this operation is optimized to include the author and their followers.
   * Use it with caution. If you need something simpler, consider refactoring this method and making the "with" option dynamic.
   * @param articleId - The id of the article
   * @returns An array of comments
   */
  async findManyByArticleId(articleId: number) {
    const result = await this.db.query.comments.findMany({
      where: eq(comments.articleId, articleId),
      orderBy: [desc(comments.createdAt)],
      with: {
        author: {
          columns: {
            id: true,
            username: true,
            bio: true,
            image: true,
          },
          with: {
            followers: true,
          },
        },
      },
    });
    return result;
  }

  async findBySlug(slug: string): Promise<ArticleRow | null> {
    const result = await this.db.query.articles.findFirst({
      where: eq(articles.slug, slug),
      with: {
        author: {
          with: {
            followers: true,
          },
        },
        favoritedBy: true,
        tags: true,
      },
    });

    return result ?? null;
  }

  async delete(commentId: number, authorId: number) {
    return await this.db
      .delete(comments)
      .where(and(eq(comments.id, commentId), eq(comments.authorId, authorId)));
  }
}
