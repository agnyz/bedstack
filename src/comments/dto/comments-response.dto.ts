import { type Static, Type } from '@sinclair/typebox';
import { CommentResponseDto } from './comment-response.dto';

export const CommentsResponseDto = Type.Object({
  comments: Type.Array(CommentResponseDto.properties.comment),
});
export type CommentsResponseDto = Static<typeof CommentsResponseDto>;
