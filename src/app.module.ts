import { articlesController } from '@/articles/articles.controller';
import { commentsController } from '@/comments/comments.controller';
import { DEFAULT_ERROR_MESSAGE } from '@/common/constants';
import {
  RealWorldError,
  formatNotFoundError,
  formatValidationError,
  isElysiaError,
} from '@/common/errors';
import { profilesController } from '@/profiles/profiles.controller';
import { tagsController } from '@/tags/tags.controller';
import { usersController } from '@/users/users.controller';
import { swagger } from '@elysiajs/swagger';
import { Elysia, NotFoundError, ValidationError } from 'elysia';
import { pick } from 'radashi';
import { description, title, version } from '../package.json';

/**
 * Add all plugins to the app
 */
export const setupApp = () => {
  return new Elysia()
    .onError(({ error, code, set }) => {
      // Manually thrown errors
      if (error instanceof RealWorldError) {
        set.status = error.statusCode;
        return pick(error, ['errors']);
      }
      // Elysia validation errors (TypeBox based)
      if (error instanceof ValidationError) {
        return formatValidationError(error);
      }

      // Elysia not found errors
      if (error instanceof NotFoundError) {
        return formatNotFoundError(error);
      }

      // Generic error message
      const reason = isElysiaError(error)
        ? error.response
        : DEFAULT_ERROR_MESSAGE;
      return {
        errors: {
          [code]: [reason],
        },
      };
    })
    .use(
      swagger({
        documentation: {
          info: { title, version, description },
          components: {
            securitySchemes: {
              tokenAuth: {
                type: 'apiKey',
                description: 'Prefix the token with "Token", e.g. "Token xxxx"',
                in: 'header',
                name: 'Authorization',
              },
            },
          },
        },
        exclude: ['/'],
        swaggerOptions: {
          persistAuthorization: true,
        },
      }),
    )
    .group('/api', (app) =>
      app
        .use(usersController)
        .use(profilesController)
        .use(articlesController)
        .use(commentsController)
        .use(tagsController),
    );
};
