import { type Static, Type } from '@sinclair/typebox';
import {
  type FollowerSchema,
  type SelectUserSchema,
  selectUserSchemaRaw,
} from '@users/users.schema.legacy';

export type Profile = Static<typeof SelectUserSchema> & {
  followers: FollowerSchema[];
};

export const ReturnedProfileSchema = Type.Object({
  profile: Type.Composite([
    Type.Omit(selectUserSchemaRaw, [
      'id',
      'email',
      'password',
      'createdAt',
      'updatedAt',
    ]),
    Type.Object({
      following: Type.Boolean(),
    }),
  ]),
});

export type ParsedProfileSchema = Static<typeof ReturnedProfileSchema>;
