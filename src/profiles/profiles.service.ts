import type { ProfilesRepository } from '@profiles/profiles.repository';
import type { ParsedProfileSchema, Profile } from '@profiles/profiles.schema';
import { NotFoundError } from 'elysia';

// TODO: We used to have a UsersRepository here, but it was removed. Why?
export class ProfilesService {
  constructor(private readonly repository: ProfilesRepository) {}

  async findByUsername(currentUserId: number, targetUsername: string) {
    const user = await this.repository.findByUsername(targetUsername);
    if (!user) {
      throw new NotFoundError('Profile not found');
    }
    return await this.generateProfileResponse(user, currentUserId);
  }

  async findByUserId(currentUserId: number | null, targetUserId: number) {
    const user = await this.repository.findByUserId(targetUserId);
    if (!user) {
      throw new NotFoundError('Profile not found');
    }
    return await this.generateProfileResponse(user, currentUserId);
  }

  async followUser(
    username: string,
    currentUserId: number,
  ): Promise<ParsedProfileSchema> {
    const userToFollow = await this.repository.findByUsername(username);
    if (!userToFollow) {
      throw new NotFoundError('User not found');
    }

    // Check if already following
    const isFollowing = await this.repository.findFollowByUsers(
      userToFollow.id,
      currentUserId,
    );
    if (!isFollowing) {
      await this.repository.followUser(currentUserId, userToFollow.id);
    }

    return this.findByUsername(currentUserId, username);
  }

  async unfollowUser(
    username: string,
    currentUserId: number,
  ): Promise<ParsedProfileSchema> {
    const userToUnfollow = await this.repository.findByUsername(username);
    if (!userToUnfollow) {
      throw new NotFoundError('User not found');
    }

    // Check if following before attempting to unfollow
    const isFollowing = await this.repository.findFollowByUsers(
      userToUnfollow.id,
      currentUserId,
    );
    if (isFollowing) {
      await this.repository.unfollowUser(currentUserId, userToUnfollow.id);
    }

    return this.findByUsername(currentUserId, username);
  }

  // TODO: This should be a mapper, not a service method
  async generateProfileResponse(
    user: Profile,
    currentUserId: number | null,
  ): Promise<ParsedProfileSchema> {
    return {
      profile: {
        bio: user.bio,
        image: user.image,
        username: user.username,
        following:
          currentUserId == null
            ? false
            : user.followers.some(
                (follower) => follower.followerId === currentUserId,
              ),
      },
    };
  }

  async findFollowedUserIds(currentUserId: number): Promise<number[]> {
    return this.repository.findFollowedUserIds(currentUserId);
  }
}
