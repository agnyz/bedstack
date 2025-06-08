import type { ProfileRow } from '../interfaces/profile-row.interface';
import type { IProfile } from '../interfaces/profile.interface';

/**
 * Map a profile row to a domain profile
 * @param profile - The profile row to map
 * @param currentUserId - The ID of the current user, if any
 * @returns The domain profile
 */
export function toDomain(
  profile: ProfileRow,
  currentUserId: number | null,
): IProfile {
  return {
    username: profile.username,
    bio: profile.bio,
    image: profile.image,
    following:
      currentUserId === null
        ? false
        : profile.followers.some(
            (follower) => follower.followerId === currentUserId,
          ),
  };
}
