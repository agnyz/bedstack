import { Elysia } from 'elysia';
import { setupUsers } from '@users/users.module';
import {
  InsertUserSchema,
  ReturnedUserSchema,
  UserLoginSchema,
  UpdateUserSchema,
} from '@users/users.schema';

export const usersPlugin = new Elysia()
  .use(setupUsers)
  .group(
    '/users',
    {
      detail: {
        tags: ['Auth'],
      },
    },
    (app) =>
      app
        .post(
          '',
          ({ body, store }) => store.usersService.createUser(body.user),
          {
            body: InsertUserSchema,
            response: ReturnedUserSchema,
            detail: {
              summary: 'Register',
            },
          },
        )
        .post(
          '/login',
          ({ body, store }) =>
            store.usersService.loginUser(body.user.email, body.user.password),
          {
            body: UserLoginSchema,
            response: ReturnedUserSchema,
            detail: {
              summary: 'Login',
            },
          },
        ),
  )
  .group('/user', { detail: { tags: ['Auth'] } }, (app) =>
    app
      .get(
        '',
        async ({ request, store }) =>
          store.usersService.findById(
            await store.authService.getUserIdFromHeader(request.headers),
          ),
        {
          beforeHandle: app.store.authService.requireLogin,
          response: ReturnedUserSchema,
          detail: {
            summary: 'Current User',
          },
        },
      )
      .put(
        '',
        async ({ request, store, body }) =>
          store.usersService.updateUser(
            await store.authService.getUserIdFromHeader(request.headers),
            body.user,
          ),
        {
          body: UpdateUserSchema,
          beforeHandle: app.store.authService.requireLogin,
          response: ReturnedUserSchema,
          detail: {
            summary: 'Update User',
          },
        },
      ),
  );
