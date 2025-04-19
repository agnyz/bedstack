import { type Static, Type } from '@sinclair/typebox';

export const CreateArticleDto = Type.Object({
  article: Type.Object({
    title: Type.String({ minLength: 1 }),
    description: Type.String({ minLength: 1 }),
    body: Type.String({ minLength: 1 }),
    slug: Type.String({ minLength: 1 }),
    tagList: Type.Optional(Type.Array(Type.String())),
  }),
});
export type CreateArticleDto = Static<typeof CreateArticleDto>;
