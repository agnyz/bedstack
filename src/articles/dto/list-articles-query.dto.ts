import { type Static, Type } from '@sinclair/typebox';
import { ArticleFeedQueryDto } from './article-feed-query.dto';

export const ListArticlesQueryDto = Type.Composite([
  ArticleFeedQueryDto,
  Type.Object({
    tag: Type.Optional(Type.String()),
    author: Type.Optional(Type.String()),
    favorited: Type.Optional(Type.String()),
  }),
]);
export type ListArticlesQueryDto = Static<typeof ListArticlesQueryDto>;
