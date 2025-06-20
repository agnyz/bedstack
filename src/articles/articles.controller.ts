import { Elysia, t } from 'elysia';
import { StatusCodes } from 'http-status-codes';
import { setupArticles } from '@/articles/articles.module';
import { DEFAULT_LIMIT, DEFAULT_OFFSET } from '@/shared/constants';
import {
  ArticleFeedQueryDto,
  ArticleResponseDto,
  ArticlesResponseDto,
  CreateArticleDto,
  ListArticlesQueryDto,
  UpdateArticleDto,
} from './dto';
import { toCreateArticleInput, toFeedResponse, toResponse } from './mappers';

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

          const {
            offset = DEFAULT_OFFSET,
            limit = DEFAULT_LIMIT,
            tag,
            author,
            favorited,
          } = query;

          return toFeedResponse(
            await store.articlesService.find(
              { tag, author, favorited },
              { pagination: { offset, limit }, currentUserId },
            ),
          );
        },
        {
          query: ListArticlesQueryDto,
          response: ArticlesResponseDto,
          detail: {
            summary: 'List Articles',
            description:
              'Returns most recent articles globally by default, provide `tag`, `author` or `favorited` query parameter to filter results\n\nAuthentication optional, will return multiple articles, ordered by most recent first',
          },
        },
      )
      .get(
        '/feed',
        async ({ query, store, request }) => {
          const currentUserId = await store.authService.getUserIdFromHeader(
            request.headers,
          );

          const { offset = DEFAULT_OFFSET, limit = DEFAULT_LIMIT } = query;

          const { articles, articlesCount } = await store.articlesService.find(
            {},
            {
              personalization: {
                followedAuthors: true,
              },
              pagination: { offset, limit },
              currentUserId,
            },
          );
          return toFeedResponse({ articles, articlesCount });
        },
        {
          beforeHandle: app.store.authService.requireLogin,
          query: ArticleFeedQueryDto,
          response: ArticlesResponseDto,
          detail: {
            summary: 'Feed Articles',
            description:
              'Can also take `limit` and `offset` query parameters like List Articles\n\nAuthentication required, will return multiple articles created by followed users, ordered by most recent first.',
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
      .post(
        '/',
        async ({ body, request, store, status }) => {
          const currentUserId = await store.authService.getUserIdFromHeader(
            request.headers,
          );
          const article = await store.articlesService.createArticle(
            toCreateArticleInput(body),
            currentUserId,
          );
          return status(StatusCodes.CREATED, toResponse(article));
        },
        {
          beforeHandle: app.store.authService.requireLogin,
          body: CreateArticleDto,
          response: {
            [StatusCodes.CREATED]: ArticleResponseDto,
          },
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
        async ({ params, store, request, set }) => {
          await store.articlesService.deleteArticle(
            params.slug,
            await store.authService.getUserIdFromHeader(request.headers),
          );
          set.status = StatusCodes.NO_CONTENT;
        },
        {
          beforeHandle: app.store.authService.requireLogin,
          response: {
            [StatusCodes.NO_CONTENT]: t.Void({
              description: 'No content',
            }),
          },
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
