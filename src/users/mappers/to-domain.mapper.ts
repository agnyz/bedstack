import type { UserRow } from '../interfaces/user-row.interface';
import type { IUser } from '../interfaces/user.interface';

/**
 * Map a user row to a domain user
 * @param user - The user row to map
 * @param token - The token to add to the user, use `authService.generateToken` to generate a token
 * @returns The mapped user
 */
export function toDomain(user: UserRow, token: string): IUser {
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    bio: user.bio,
    image: user.image,
    token,
    createdAt: new Date(user.createdAt),
    updatedAt: new Date(user.updatedAt),
  };
}
