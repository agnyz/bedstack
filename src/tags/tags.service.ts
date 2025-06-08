import type { NewArticleTagRow, TagRow } from './interfaces/tag-row.interface';
import type { IArticleTag, ITag } from './interfaces/tag.interface';
import { toArticleTagDomain, toDomain } from './mappers';
import type { TagsRepository } from './tags.repository';

export class TagsService {
  constructor(private readonly repository: TagsRepository) {}

  async getTags(): Promise<ITag[]> {
    const tagRows = await this.repository.findTags();
    return tagRows.map(toDomain);
  }

  /**
   * Upsert tags in the database
   * @param tagNames - The names of the tags to upsert
   * @returns The upserted tags
   */
  async upsertTags(tagNames: string[]): Promise<ITag[]> {
    const tagRows = await this.repository.upsertTags(tagNames);
    return tagRows.map(toDomain);
  }

  /**
   * Upsert tags for an article. This method internally calls `upsertTags` to ensure that the tags exist in the database, so you do not need to call `upsertTags` before calling this method.
   * @param articleId - The ID of the article
   * @param tagNames - The names of the tags to upsert
   * @returns The upserted article tags
   */
  async upsertArticleTags(
    articleId: number,
    tagNames: string[],
  ): Promise<IArticleTag[]> {
    // TODO: use transaction
    if (tagNames.length === 0) return [];

    // Ensure every tag exists
    await this.upsertTags(tagNames);

    // Delete old tags for the article
    const articleTags = await this.repository.findArticleTags(articleId);
    const tagsToDelete = articleTags
      .filter((tag) => !tagNames.includes(tag.tagName))
      .map((tag) => tag.tagName);
    if (tagsToDelete.length > 0) {
      await this.repository.deleteArticleTags({
        articleId,
        tagNames: tagsToDelete,
      });
    }

    // Upsert new and existing tags
    const tagsToUpsert: NewArticleTagRow[] = tagNames.map((tagName) => ({
      articleId,
      tagName,
    }));
    const tagRows = await this.repository.upsertArticleTags(tagsToUpsert);
    return tagRows.map(toArticleTagDomain);
  }
}
