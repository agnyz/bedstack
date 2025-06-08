import type { ProfilesRepository } from '@profiles/profiles.repository';
import { NotFoundError } from 'elysia';
import type { IProfile } from './interfaces';
import { toDomain } from './mappers';

// TODO: We used to have a UsersRepository here, but it was removed. Why?
export class ProfilesService {
  constructor(private readonly repository: ProfilesRepository) {}

  async findProfileByUsername(
    currentUserId: number | null,
    targetUsername: string,
  ): Promise<IProfile> {
    const profile = await this.repository.findProfileByUsername(targetUsername);
    if (!profile) {
      throw new NotFoundError('Profile not found');
    }
    return toDomain(profile, currentUserId);
  }

  async findProfileByUserId(
    currentUserId: number | null,
    targetUserId: number,
  ): Promise<IProfile> {
    const profile = await this.repository.findProfileByUserId(targetUserId);
    if (!profile) {
      throw new NotFoundError('Profile not found');
    }
    return toDomain(profile, currentUserId);
  }

  async followUser(username: string, currentUserId: number): Promise<IProfile> {
    const profileToFollow =
      await this.repository.findProfileByUsername(username);
    if (!profileToFollow) {
      throw new NotFoundError('Profile not found');
    }

    // Check if already following
    const isFollowing = await this.repository.findFollowByUsers(
      profileToFollow.id,
      currentUserId,
    );
    if (!isFollowing) {
      await this.repository.followUser(currentUserId, profileToFollow.id);
    }

    return this.findProfileByUsername(currentUserId, username);
  }

  async unfollowUser(
    username: string,
    currentUserId: number,
  ): Promise<IProfile> {
    const profileToUnfollow =
      await this.repository.findProfileByUsername(username);
    if (!profileToUnfollow) {
      throw new NotFoundError('Profile not found');
    }

    // Check if following before attempting to unfollow
    const isFollowing = await this.repository.findFollowByUsers(
      profileToUnfollow.id,
      currentUserId,
    );
    if (isFollowing) {
      await this.repository.unfollowUser(currentUserId, profileToUnfollow.id);
    }

    return this.findProfileByUsername(currentUserId, username);
  }

  async findFollowedUserIds(currentUserId: number): Promise<number[]> {
    return this.repository.findFollowedUserIds(currentUserId);
  }
}
