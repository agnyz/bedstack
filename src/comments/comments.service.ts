import type { ArticlesService } from '@/articles/articles.service';
import { RealWorldError } from '@/common/errors';
import type { ProfilesService } from '@/profiles/profiles.service';
import { NotFoundError } from 'elysia';
import { StatusCodes } from 'http-status-codes';
import type { CommentsRepository } from './comments.repository';
import type { IComment, NewCommentRow } from './interfaces';
import { toDomain, toNewCommentRow } from './mappers';

export class CommentsService {
  constructor(
    private readonly commentsRepository: CommentsRepository,
    private readonly articlesService: ArticlesService,
    private readonly profilesService: ProfilesService,
  ) {}

  async createComment(
    articleSlug: string,
    commentBody: { body: string },
    userId: number,
  ): Promise<IComment> {
    const article = await this.articlesService.findBySlug(articleSlug, null);

    const commentData: NewCommentRow = toNewCommentRow(
      commentBody,
      article.id,
      userId,
    );

    const comment = await this.commentsRepository.create(commentData);
    const authorProfile = await this.profilesService.findProfileByUserId(
      userId,
      comment.authorId,
    );

    return toDomain(
      comment,
      {
        username: authorProfile.username,
        bio: authorProfile.bio ?? '',
        image: authorProfile.image ?? '',
      },
      false, // author is always the current user, so following is false
    );
  }

  /**
   * Get all comments for an article
   * @param articleSlug - The slug of the article
   * @param currentUserId - The id of the current user. If provided, the profile of the author will be returned
   * @returns An array of comments
   */
  async getComments(
    articleSlug: string,
    currentUserId?: number,
  ): Promise<IComment[]> {
    const article = await this.articlesService.findBySlug(
      articleSlug,
      currentUserId ?? null,
    );

    const comments = await this.commentsRepository.findManyByArticleId(
      article.id,
    );

    return comments.map((comment) =>
      toDomain(
        comment,
        {
          username: comment.author.username,
          bio: comment.author.bio,
          image: comment.author.image,
        },
        currentUserId
          ? comment.author.followers.some((f) => f.followerId === currentUserId)
          : false,
      ),
    );
  }

  async deleteComment(
    articleSlug: string,
    commentId: number,
    userId: number,
  ): Promise<void> {
    const article = await this.articlesService.findBySlug(articleSlug, null);

    const comment = await this.commentsRepository.findById(commentId);

    if (!comment) {
      throw new NotFoundError('comment');
    }

    if (comment.articleId !== article.id) {
      throw new RealWorldError(StatusCodes.NOT_FOUND, {
        comment: ['does not belong to article'],
      });
    }

    if (comment.authorId !== userId) {
      throw new RealWorldError(StatusCodes.FORBIDDEN, {
        comment: ['not owned by user'],
      });
    }

    await this.commentsRepository.delete(commentId, userId);
  }
}
