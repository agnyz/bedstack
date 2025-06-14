import type { ArticleResponseDto } from '../dto';
import type { IArticle } from '../interfaces';

export function toResponse(article: IArticle): ArticleResponseDto {
  const authorProfile = {
    username: article.author.username,
    bio: article.author.bio,
    image: article.author.image,
    following: article.author.following,
  };
  return {
    article: {
      slug: article.slug,
      title: article.title,
      description: article.description,
      body: article.body,
      tagList: article.tagList,
      createdAt: article.createdAt.toISOString(),
      updatedAt: article.updatedAt.toISOString(),
      author: authorProfile,
      favorited: article.favorited,
      favoritesCount: article.favoritesCount,
    },
  };
}
