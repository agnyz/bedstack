import {
  CreateUserDto,
  LoginUserDto,
  UpdateUserDto,
  UserResponseDto,
} from '@/users/dto';
import { setupUsers } from '@/users/users.module';
import { Elysia } from 'elysia';

/**
 * Users controller handling user registration, authentication, and profile management
 * following the RealWorld API specification.
 */
export const usersController = new Elysia()
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
            body: CreateUserDto,
            response: UserResponseDto,
            detail: {
              summary: 'Registration',
              description: 'Register a new user',
            },
          },
        )
        .post(
          '/login',
          ({ body, store }) =>
            store.usersService.loginUser(body.user.email, body.user.password),
          {
            body: LoginUserDto,
            response: UserResponseDto,
            detail: {
              summary: 'Authentication',
              description: 'Login for existing user',
            },
          },
        ),
  )
  .group(
    '/user',
    {
      detail: {
        tags: ['User'],
      },
    },
    (app) =>
      app
        .get(
          '',
          async ({ request, store }) =>
            store.usersService.findById(
              await store.authService.getUserIdFromHeader(request.headers),
            ),
          {
            beforeHandle: app.store.authService.requireLogin,
            response: UserResponseDto,
            detail: {
              summary: 'Get Current User',
              description: 'Get the current user profile',
              security: [
                {
                  tokenAuth: [],
                },
              ],
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
            body: UpdateUserDto,
            beforeHandle: app.store.authService.requireLogin,
            response: UserResponseDto,
            detail: {
              summary: 'Update User',
              description: 'Update user information for current user',
              security: [
                {
                  tokenAuth: [],
                },
              ],
            },
          },
        ),
  );
