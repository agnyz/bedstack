import { type Static, Type } from '@sinclair/typebox';

export const ArticleResponseDto = Type.Object({
  slug: Type.String(),
  title: Type.String(),
  description: Type.String(),
  body: Type.String(),
  tagList: Type.Array(Type.String()),
  createdAt: Type.String(),
  updatedAt: Type.String(),
  favorited: Type.Boolean(),
  favoritesCount: Type.Number(),
  author: Type.Object({
    username: Type.String(),
    bio: Type.String(),
    image: Type.String(),
    following: Type.Boolean(),
  }),
});
export type ArticleResponseDto = Static<typeof ArticleResponseDto>;
