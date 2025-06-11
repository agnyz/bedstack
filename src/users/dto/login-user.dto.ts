import { type Static, Type } from '@sinclair/typebox';

export const LoginUserDto = Type.Object({
  user: Type.Object({
    email: Type.String({
      format: 'email',
      minLength: 3,
      maxLength: 255,
      description: 'Valid email address',
    }),
    password: Type.String(),
  }),
});

export type LoginUserDto = Static<typeof LoginUserDto>;
