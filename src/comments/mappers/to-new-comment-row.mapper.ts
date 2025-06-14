import type { NewCommentRow } from '../interfaces';

export function toNewCommentRow(
  body: { body: string },
  articleId: number,
  authorId: number,
): NewCommentRow {
  return {
    body: body.body,
    articleId,
    authorId,
  };
}
