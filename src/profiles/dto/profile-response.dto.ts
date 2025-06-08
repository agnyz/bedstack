import { type Static, Type } from '@sinclair/typebox';

export const profileResponseSchema = Type.Object({
  profile: Type.Object({
    username: Type.String(),
    bio: Type.Union([Type.String(), Type.Null()]),
    image: Type.Union([Type.String(), Type.Null()]),
    following: Type.Boolean(),
  }),
});

export type ProfileResponseDto = Static<typeof profileResponseSchema>;
