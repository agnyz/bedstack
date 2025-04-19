import { MAX_PAGINATION_LIMIT } from '@constants';
import { type Static, Type } from '@sinclair/typebox';

export const ArticleFeedQueryDto = Type.Object({
  limit: Type.Optional(
    Type.Number({
      minimum: 1,
      maximum: MAX_PAGINATION_LIMIT,
      default: 20,
    }),
  ),
  offset: Type.Optional(Type.Number({ minimum: 0, default: 0 })),
});
export type ArticleFeedQueryDto = Static<typeof ArticleFeedQueryDto>;
