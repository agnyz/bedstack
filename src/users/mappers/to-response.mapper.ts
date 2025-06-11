import type { UserResponseDto } from '../dto';
import type { IUser } from '../interfaces';

export function toResponse(user: IUser): UserResponseDto {
  return {
    user: {
      email: user.email,
      token: user.token,
      username: user.username,
      bio: user.bio,
      image: user.image,
    },
  };
}
