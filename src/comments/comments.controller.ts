import { Elysia, t } from 'elysia';
import { setupComments } from './comments.module';
import {
  CommentResponseDto,
  CommentsResponseDto,
  CreateCommentDto,
} from './dto';
import { toCommentResponse, toCommentsResponse } from './mappers';

export const commentsController = new Elysia().use(setupComments).group(
  '/articles/:slug/comments',
  {
    detail: {
      tags: ['Comments'],
    },
  },
  (app) =>
    app
      .post(
        '/',
        async ({ body, params, store, request }) => {
          const comment = await store.commentsService.createComment(
            params.slug,
            body.comment,
            await store.authService.getUserIdFromHeader(request.headers),
          );
          return toCommentResponse(comment);
        },
        {
          beforeHandle: app.store.authService.requireLogin,
          body: CreateCommentDto,
          response: CommentResponseDto,
          detail: {
            summary: 'Add Comments to an Article',
            description: 'Authentication required, returns the created Comment',
            security: [
              {
                tokenAuth: [],
              },
            ],
          },
        },
      )
      .get(
        '/',
        async ({ params, store, request }) => {
          const userId = await store.authService.getOptionalUserIdFromHeader(
            request.headers,
          );
          const comments = await store.commentsService.getComments(
            params.slug,
            userId === null ? undefined : userId,
          );
          return toCommentsResponse(comments);
        },
        {
          response: CommentsResponseDto,
          detail: {
            summary: 'Get Comments from an Article',
            description: 'Authentication optional, returns multiple comments',
          },
        },
      )
      .delete(
        '/:id',
        async ({ params, store, request }) => {
          await store.commentsService.deleteComment(
            params.slug,
            params.id,
            await store.authService.getUserIdFromHeader(request.headers),
          );
        },
        {
          beforeHandle: app.store.authService.requireLogin,
          params: t.Object({
            slug: t.String(),
            id: t.Numeric(),
          }),
          detail: {
            summary: 'Delete Comment',
            description: 'Authentication required',
            security: [
              {
                tokenAuth: [],
              },
            ],
          },
        },
      ),
);
