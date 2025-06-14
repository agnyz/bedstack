import type { ArticleRow, IArticle } from '../interfaces';

type ToDomainOptions = {
  tagList?: string[];
  currentUserId?: number;
};

export function toDomain(
  article: ArticleRow,
  { tagList, currentUserId }: ToDomainOptions,
): IArticle {
  return {
    id: article.id,
    slug: article.slug,
    title: article.title,
    description: article.description,
    tagList: tagList ?? article.tags.map((t) => t.tagName),
    createdAt: article.createdAt,
    updatedAt: article.updatedAt,
    favorited: article.favoritedBy.some(
      (user) => user.userId === currentUserId,
    ),
    favoritesCount: article.favoritedBy.length,
    body: article.body,
    author: {
      username: article.author.username,
      bio: article.author.bio,
      image: article.author.image,
      following: article.author.followers.some(
        (follower) => follower.followerId === currentUserId,
      ),
    },
  };
}
