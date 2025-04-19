import { type Static, Type } from '@sinclair/typebox';

export const CreateCommentDto = Type.Object({
  comment: Type.Object({
    body: Type.String({ minLength: 1 }),
  }),
});
export type CreateCommentDto = Static<typeof CreateCommentDto>;
