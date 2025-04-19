import { type Static, Type } from '@sinclair/typebox';

// TODO: instead of defining this from scratch, can we use 'CreateArticleDto'?
export const UpdateArticleDto = Type.Object({
  article: Type.Object({
    title: Type.Optional(Type.String({ minLength: 1 })),
    description: Type.Optional(Type.String({ minLength: 1 })),
    body: Type.Optional(Type.String({ minLength: 1 })),
    tagList: Type.Optional(Type.Array(Type.String())),
  }),
});
export type UpdateArticleDto = Static<typeof UpdateArticleDto>;
