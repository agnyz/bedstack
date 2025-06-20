import type { IComment } from '../interfaces/comment.interface';
import type { CommentRow } from '../interfaces/comment-row.interface';

type ToCommentsDomainAuthor = {
  username: string;
  bio: string | null;
  image: string | null;
};

/**
 * Map a comment row to a domain comment
 * @param comment - The comment row to map
 * @param author - The author of the comment
 * @param following - Whether the current user is following the author
 * @returns The mapped comment
 */
export function toDomain(
  comment: CommentRow,
  author: ToCommentsDomainAuthor,
  following: boolean,
): IComment {
  return {
    id: comment.id,
    body: comment.body,
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
    author: {
      username: author.username,
      bio: author.bio,
      image: author.image,
      following,
    },
  };
}
