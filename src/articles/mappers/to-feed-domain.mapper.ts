import type { ArticleFeedRow, IArticleFeed } from '../interfaces';

export function toFeedDomain(article: ArticleFeedRow): IArticleFeed {
  return {
    slug: article.slug,
    title: article.title,
    description: article.description,
    tagList: article.tagList,
    createdAt: article.createdAt,
    updatedAt: article.updatedAt,
    favorited: article.favorited,
    favoritesCount: article.favoritesCount,
    author: article.author,
  };
}
