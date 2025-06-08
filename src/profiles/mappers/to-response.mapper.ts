import type { ProfileResponseDto } from '../dto';
import type { IProfile } from '../interfaces';

/**
 * Map a domain profile to a response DTO
 * @param profile - The domain profile to map
 * @returns The response DTO
 */
export function toResponse(profile: IProfile): ProfileResponseDto {
  return {
    profile: {
      username: profile.username,
      bio: profile.bio,
      image: profile.image,
      following: profile.following,
    },
  };
}
