import { Elysia } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import { jwt } from '@elysiajs/jwt';
import { title, version, description } from '../package.json';
import { usersPlugin } from '@/users/users.plugin';
import {
  AuthenticationError,
  AuthorizationError,
  ERROR_CODE_STATUS_MAP,
} from '@/errors';
import { ALG } from '@/auth';
import { env } from '@/config';

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
    })
    .onError(({ error, code, set }) => {
      set.status = ERROR_CODE_STATUS_MAP[code];
      const errorType = 'type' in error ? error.type : 'internal';
      return { errors: { [errorType]: error.message } };
    })
    .use(
      swagger({
        documentation: {
          info: { title, version, description },
        },
      }),
    )
    .use(
      jwt({
        name: 'jwt',
        secret: env.JWT_SECRET,
        alg: ALG,
      }),
    )
    .group('/api', (app) => app.use(usersPlugin));
};
