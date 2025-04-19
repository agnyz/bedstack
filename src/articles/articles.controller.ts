import { setupArticles } from '@articles/articles.module';
import { CommentResponseDto, CreateCommentDto } from '@comments/dto';
import { Elysia, t } from 'elysia';
import {
  ArticleResponseDto,
  ArticlesResponseDto,
  CreateArticleDto,
  ListArticlesQueryDto,
  UpdateArticleDto,
} from './dto';
import { toCreateArticleInput, toResponse } from './mappers/articles.mapper';

export const articlesController = new Elysia().use(setupArticles).group(
  '/articles',
  {
    detail: {
      tags: ['Articles'],
    },
  },
  (app) =>
    app
      .get(
        '/',
        async ({ query, store, request }) => {
          const currentUserId =
            await store.authService.getOptionalUserIdFromHeader(
              request.headers,
            );

          // TODO: should we assign the defaults here, in the service, or both?
          const { offset = 0, limit = 20, tag, author, favorited } = query;

          const { articles, articlesCount } = await store.articlesService.find(
            { tag, author, favorited },
            { pagination: { offset, limit }, currentUserId },
          );

          return {
            articles: articles.map((article) => toResponse(article)),
            articlesCount,
          };
        },
        {
          query: ListArticlesQueryDto,
          response: ArticlesResponseDto,
          detail: { summary: 'List Articles' },
        },
      )
      .post(
        '/',
        async ({ body, request, store }) => {
          const currentUserId = await store.authService.getUserIdFromHeader(
            request.headers,
          );
          const article = await store.articlesService.createArticle(
            toCreateArticleInput(body.article),
            currentUserId,
          );
          return toResponse(article);
        },
        {
          beforeHandle: app.store.authService.requireLogin,
          body: CreateArticleDto,
          response: ArticleResponseDto,
          detail: {
            summary: 'Create Article',
            security: [
              {
                tokenAuth: [],
              },
            ],
          },
        },
      )
      .get(
        '/feed',
        async ({ query, store, request }) => {
          const currentUserId = await store.authService.getUserIdFromHeader(
            request.headers,
          );

          // TODO: should we assign the defaults here, in the service, or both?
          const { offset = 0, limit = 20, tag, author, favorited } = query;

          // TODO: do we need both currentUserId and personalization?
          const { articles, articlesCount } = await store.articlesService.find(
            { tag, author, favorited },
            {
              personalization: {
                followedAuthors: true,
              },
              pagination: { offset, limit },
              currentUserId,
            },
          );
          return {
            articles: articles.map((article) => toResponse(article)),
            articlesCount,
          };
        },
        {
          beforeHandle: app.store.authService.requireLogin,
          query: ListArticlesQueryDto,
          response: ArticlesResponseDto,
          detail: {
            summary: 'Article Feed',
            security: [
              {
                tokenAuth: [],
              },
            ],
          },
        },
      )
      .get(
        '/:slug',
        async ({ params, store, request }) => {
          const article = await store.articlesService.findBySlug(
            params.slug,
            await store.authService.getOptionalUserIdFromHeader(
              request.headers,
            ),
          );
          return toResponse(article);
        },
        {
          response: ArticleResponseDto,
          detail: {
            summary: 'Get Article',
          },
        },
      )
      .put(
        '/:slug',
        async ({ params, body, store, request }) => {
          const article = await store.articlesService.updateArticle(
            params.slug,
            body.article,
            await store.authService.getUserIdFromHeader(request.headers),
          );
          return toResponse(article);
        },
        {
          beforeHandle: app.store.authService.requireLogin,
          body: UpdateArticleDto,
          response: ArticleResponseDto,
          detail: {
            summary: 'Update Article',
            security: [
              {
                tokenAuth: [],
              },
            ],
          },
        },
      )
      .delete(
        '/:slug',
        async ({ params, store, request }) => {
          await store.articlesService.deleteArticle(
            params.slug,
            await store.authService.getUserIdFromHeader(request.headers),
          );
        },
        {
          beforeHandle: app.store.authService.requireLogin,
          detail: {
            summary: 'Delete Article',
            security: [
              {
                tokenAuth: [],
              },
            ],
          },
        },
      )
      .delete(
        '/:slug',
        async ({ params, store, request }) => {
          await store.articlesService.deleteArticle(
            params.slug,
            await store.authService.getUserIdFromHeader(request.headers),
          );
        },
        {
          beforeHandle: app.store.authService.requireLogin,
          detail: {
            summary: 'Delete Article',
            security: [
              {
                tokenAuth: [],
              },
            ],
          },
        },
      )
      .post(
        '/:slug/comments',
        async ({ body, params, store, request }) => {
          const comment = await store.commentsService.createComment(
            params.slug,
            body.comment,
            await store.authService.getUserIdFromHeader(request.headers),
          );
          return { comment };
        },
        {
          beforeHandle: app.store.authService.requireLogin,
          body: CreateCommentDto,
          response: CommentResponseDto,
          detail: {
            summary: 'Add Comment to Article',
          },
        },
      )
      .get(
        '/:slug/comments',
        async ({ params, store, request }) => {
          const userId = await store.authService.getOptionalUserIdFromHeader(
            request.headers,
          );
          return {
            comments: await store.commentsService.getComments(
              params.slug,
              userId === null ? undefined : userId,
            ),
          };
        },
        {
          response: t.Object({
            comments: t.Array(CommentResponseDto),
          }),
          detail: {
            summary: 'Get Comments from Article',
          },
        },
      )
      .delete(
        '/:slug/comments/:id',
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
          },
        },
      )
      .post(
        '/:slug/favorite',
        async ({ params, store, request }) => {
          const article = await store.articlesService.favoriteArticle(
            params.slug,
            await store.authService.getUserIdFromHeader(request.headers),
          );
          return toResponse(article);
        },
        {
          beforeHandle: app.store.authService.requireLogin,
          response: ArticleResponseDto,
          detail: {
            summary: 'Favorite Article',
            security: [
              {
                tokenAuth: [],
              },
            ],
          },
        },
      )
      .delete(
        '/:slug/favorite',
        async ({ params, store, request }) => {
          const article = await store.articlesService.unfavoriteArticle(
            params.slug,
            await store.authService.getUserIdFromHeader(request.headers),
          );
          return toResponse(article);
        },
        {
          beforeHandle: app.store.authService.requireLogin,
          response: ArticleResponseDto,
          detail: {
            summary: 'Unfavorite Article',
            security: [
              {
                tokenAuth: [],
              },
            ],
          },
        },
      ),
);
