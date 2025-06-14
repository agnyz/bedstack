import { articlesController } from '@articles/articles.controller';
import { swagger } from '@elysiajs/swagger';
import {
  AuthenticationError,
  AuthorizationError,
  BadRequestError,
  getErrorStatusFromCode,
} from '@errors';
import { profilesPlugin } from '@profiles/profiles.plugin';
import { tagsPlugin } from '@tags/tags.plugin';
import { usersPlugin } from '@users/users.plugin';
import { Elysia } from 'elysia';
import { description, title, version } from '../package.json';
import { commentsController } from './comments/comments.controller';

// the file name is in the spirit of NestJS, where app module is the device in charge of putting together all the pieces of the app
// see: https://docs.nestjs.com/modules

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
        .use(usersPlugin)
        .use(profilesPlugin)
        .use(articlesController)
        .use(commentsController)
        .use(tagsPlugin),
    );
};
