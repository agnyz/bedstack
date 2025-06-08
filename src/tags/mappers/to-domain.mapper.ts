import type { ArticleTagRow, TagRow } from '../interfaces/tag-row.interface';
import type { IArticleTag, ITag } from '../interfaces/tag.interface';

export const toDomain = (row: TagRow): ITag => ({
  name: row.name,
  createdAt: row.createdAt,
  updatedAt: row.updatedAt,
});

export const toArticleTagDomain = (row: ArticleTagRow): IArticleTag => ({
  articleId: row.articleId,
  tagName: row.tagName,
  createdAt: row.createdAt,
  updatedAt: row.updatedAt,
});
