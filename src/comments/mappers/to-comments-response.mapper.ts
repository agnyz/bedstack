import type { IComment } from '../interfaces/comment.interface';
import { toCommentResponse } from './to-comment-response.mapper';

export function toCommentsResponse(comments: IComment[]): {
  comments: ReturnType<typeof toCommentResponse>['comment'][];
} {
  return { comments: comments.map((c) => toCommentResponse(c).comment) };
}
