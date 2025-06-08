import { type Static, Type } from '@sinclair/typebox';

export const TagsResponseDto = Type.Object({
  tags: Type.Array(Type.String()),
});

export type TagsResponseDto = Static<typeof TagsResponseDto>;
