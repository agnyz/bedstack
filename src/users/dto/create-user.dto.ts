import { type Static, Type } from '@sinclair/typebox';

export const CreateUserDto = Type.Object({
  user: Type.Object({
    email: Type.String({
      format: 'email',
      minLength: 3,
      maxLength: 255,
      description: 'Valid email address',
    }),
    password: Type.String({
      minLength: 8,
      maxLength: 100,
      pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d@$!%*?&]{8,}$',
      description:
        'Password must be at least 8 characters and contain uppercase, lowercase, and numbers',
    }),
    username: Type.String({
      minLength: 3,
      maxLength: 50,
      pattern: '^[a-zA-Z0-9_-]+$',
      description:
        'Username must be 3-50 characters and contain only letters, numbers, underscores, and hyphens',
    }),
    bio: Type.Optional(
      Type.Union([Type.String({ maxLength: 1000 }), Type.Null()]),
    ),
    image: Type.Optional(
      Type.Union([Type.String({ format: 'uri' }), Type.Null()]),
    ),
  }),
});

export type CreateUserDto = Static<typeof CreateUserDto>;
