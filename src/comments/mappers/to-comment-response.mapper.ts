import type { CommentResponseDto } from '../dto/comment-response.dto';
import type { IComment } from '../interfaces/comment.interface';

export const toCommentResponse = (comment: IComment): CommentResponseDto => ({
  comment: {
    id: comment.id,
    createdAt: comment.createdAt.toISOString(),
    updatedAt: comment.updatedAt.toISOString(),
    body: comment.body,
    author: {
      username: comment.author.username,
      bio: comment.author.bio,
      image: comment.author.image,
      following: comment.author.following,
    },
  },
});
