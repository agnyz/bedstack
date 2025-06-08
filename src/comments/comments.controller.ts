import { Elysia, t } from 'elysia';
import { setupComments } from './comments.module';
import { CommentResponseDto, CreateCommentDto } from './dto';
import { toCommentResponse } from './mappers/comments.mapper';

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
          return { comments: comments.map(toCommentResponse) };
        },
        {
          response: t.Object({
            comments: t.Array(CommentResponseDto),
          }),
          detail: {
            summary: 'Get Comments from an Article',
          },
        },
      )
      .delete(
        '/:id',
        async ({ params, store, request }) => {
          await store.commentsService.deleteComment(
            params.slug,
            Number.parseInt(params.id, 10),
            await store.authService.getUserIdFromHeader(request.headers),
          );
        },
        {
          beforeHandle: app.store.authService.requireLogin,
          params: t.Object({
            slug: t.String(),
            id: t.String(),
          }),
          detail: {
            summary: 'Delete Comment',
            security: [
              {
                tokenAuth: [],
              },
            ],
          },
        },
      ),
);
