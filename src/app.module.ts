import {
  AuthenticationError,
  AuthorizationError,
  BadRequestError,
  getErrorStatusFromCode,
} from '@/shared/errors';
import { articlesController } from '@articles/articles.controller';
import { swagger } from '@elysiajs/swagger';
import { usersController } from '@users/users.controller';
import { Elysia } from 'elysia';
import { description, title, version } from '../package.json';
import { commentsController } from './comments/comments.controller';
import { profilesController } from './profiles/profiles.controller';
import { tagsController } from './tags/tags.controller';

/**
 * Add all plugins to the app
 */
export const setupApp = () => {
  return new Elysia()
    .error({
      AUTHENTICATION: AuthenticationError,
      AUTHORIZATION: AuthorizationError,
      BAD_REQUEST: BadRequestError,
    })
    .onError(({ error, code, set }) => {
      set.status = getErrorStatusFromCode(code);
      const errorType = 'type' in error ? error.type : 'internal';
      return {
        errors: {
          [errorType]: 'message' in error ? error.message : 'An error occurred',
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
