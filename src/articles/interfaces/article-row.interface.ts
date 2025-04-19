import type { Profile } from '@/profiles/profiles.schema';
import type { ArticleTag } from '@/tags/tags.schema';
import type { InferSelectModel } from 'drizzle-orm';
import type { articles, favoriteArticles } from '../articles.schema';

type ArticleFavoritedBy = InferSelectModel<typeof favoriteArticles>;

export interface ArticleRow
  extends Omit<InferSelectModel<typeof articles>, 'authorId'> {
  author: Profile;
  favoritedBy: ArticleFavoritedBy[];
  tags: ArticleTag[];
}
