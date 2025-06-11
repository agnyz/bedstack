import type { Database } from '@/database/database.providers';
import { and, eq, inArray } from 'drizzle-orm';
import type {
  ArticleTagRow,
  NewArticleTagRow,
  TagRow,
} from './interfaces/tag-row.interface';
import { articleTags, tags } from './tags.schema';

export class TagsRepository {
  constructor(private readonly db: Database) {}

  async findTags(): Promise<TagRow[]> {
    return await this.db.query.tags.findMany();
  }

  async upsertTags(names: string[]): Promise<TagRow[]> {
    return await this.db
      .insert(tags)
      .values(names.map((name) => ({ name })))
      .onConflictDoUpdate({
        target: tags.name,
        set: { updatedAt: new Date() },
      })
      .returning();
  }

  async findArticleTags(articleId: number): Promise<ArticleTagRow[]> {
    return await this.db.query.articleTags.findMany({
      where: eq(articleTags.articleId, articleId),
    });
  }

  async upsertArticleTags(data: NewArticleTagRow[]): Promise<ArticleTagRow[]> {
    return await this.db
      .insert(articleTags)
      .values(data)
      .onConflictDoUpdate({
        target: [articleTags.articleId, articleTags.tagName],
        set: { updatedAt: new Date() },
      })
      .returning();
  }

  async deleteArticleTags({
    articleId,
    tagNames,
  }: {
    articleId: number;
    tagNames?: string[];
  }): Promise<ArticleTagRow[]> {
    const filters = [];
    // articleId is required to ensure we only delete tags for a specific article
    filters.push(eq(articleTags.articleId, articleId));

    // If tagNames are provided, delete only those tags
    if (tagNames) {
      filters.push(inArray(articleTags.tagName, tagNames));
    }

    return await this.db
      .delete(articleTags)
      .where(and(...filters))
      .returning();
  }
}
