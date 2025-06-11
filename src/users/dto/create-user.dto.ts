import { type Static, Type } from '@sinclair/typebox';

export const CreateUserDto = Type.Object({
  user: Type.Object({
    email: Type.String({
      format: 'email',
      minLength: 3,
      maxLength: 255,
      description: 'must be a valid email address',
    }),
    password: Type.String({
      minLength: 8,
      maxLength: 100,
      pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d@$!%*?&]{8,}$',
      description:
        'must be at least 8 characters and contain uppercase, lowercase, and numbers',
    }),
    username: Type.String({
      minLength: 3,
      maxLength: 50,
      pattern: '^[a-zA-Z0-9_-]+$',
      description:
        'must be 3-50 characters and contain only letters, numbers, underscores, and hyphens',
    }),
    bio: Type.Optional(Type.String({ maxLength: 1000 })),
    image: Type.Optional(Type.String({ format: 'uri' })),
  }),
});

export type CreateUserDto = Static<typeof CreateUserDto>;
