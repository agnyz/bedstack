import { type Static, Type } from '@sinclair/typebox';

export const UserResponseDto = Type.Object({
  user: Type.Object({
    email: Type.String(),
    token: Type.String(),
    username: Type.String(),
    bio: Type.Union([Type.String(), Type.Null()]),
    image: Type.Union([Type.String(), Type.Null()]),
  }),
});

export type UserResponseDto = Static<typeof UserResponseDto>;
