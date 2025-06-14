import type { ArticlesResponseDto } from '../dto';
import type { IArticleFeed } from '../interfaces';

export function toFeedResponse({
  articles,
  articlesCount,
}: { articles: IArticleFeed[]; articlesCount?: number }): ArticlesResponseDto {
  const articlesResponse = articles.map((article) => ({
    slug: article.slug,
    title: article.title,
    description: article.description,
    tagList: article.tagList,
    createdAt: article.createdAt.toISOString(),
    updatedAt: article.updatedAt.toISOString(),
    favorited: article.favorited,
    favoritesCount: article.favoritesCount,
    author: article.author,
  }));
  return {
    articles: articlesResponse,
    articlesCount: articlesCount ?? articlesResponse.length,
  };
}
