import { type Static, Type } from '@sinclair/typebox';
import { ArticleResponseDto } from './article-response.dto';

export const ArticlesResponseDto = Type.Object({
  articles: Type.Array(Type.Omit(ArticleResponseDto, ['body'])),
  articlesCount: Type.Number(),
});
export type ArticlesResponseDto = Static<typeof ArticlesResponseDto>;
