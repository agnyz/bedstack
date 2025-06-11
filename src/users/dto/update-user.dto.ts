import { type Static, Type } from '@sinclair/typebox';
import { CreateUserDto } from './create-user.dto';

export const UpdateUserDto = Type.Object({
  user: Type.Partial(Type.Object(CreateUserDto.properties.user.properties)),
});

export type UpdateUserDto = Static<typeof UpdateUserDto>;
