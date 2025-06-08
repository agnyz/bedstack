import type { Database } from '@/database.providers';
import type { UserFollowRow } from '@users/interfaces';
import { userFollows, users } from '@users/users.model';
import { and, eq } from 'drizzle-orm';
import type { ProfileRow } from './interfaces';

export class ProfilesRepository {
  constructor(private readonly db: Database) {}

  async findProfileByUsername(
    targetUsername: string,
  ): Promise<ProfileRow | null> {
    const result = await this.db.query.users.findMany({
      where: eq(users.username, targetUsername),
      with: { followers: true },
    });
    if (result.length === 0) {
      return null;
    }
    return result[0];
  }

  async findProfileByUserId(targetUserId: number): Promise<ProfileRow | null> {
    const result = await this.db.query.users.findMany({
      where: eq(users.id, targetUserId),
      with: { followers: true },
    });
    if (result.length === 0) {
      return null;
    }
    return result[0];
  }

  async findFollowedUserIds(currentUserId: number): Promise<number[]> {
    const results = await this.db
      .select({ followedId: userFollows.followedId })
      .from(userFollows)
      .where(eq(userFollows.followerId, currentUserId));

    return results.map((r) => r.followedId);
  }

  async followUser(
    currentUserId: number,
    userToFollow: number,
  ): Promise<UserFollowRow> {
    const result = await this.db
      .insert(userFollows)
      .values({ followedId: userToFollow, followerId: currentUserId })
      .returning();
    return result[0];
  }

  async unfollowUser(
    currentUserId: number,
    userToUnfollow: number,
  ): Promise<UserFollowRow | undefined> {
    const result = await this.db
      .delete(userFollows)
      .where(
        and(
          eq(userFollows.followedId, userToUnfollow),
          eq(userFollows.followerId, currentUserId),
        ),
      )
      .returning();
    return result[0];
  }

  async findFollowByUsers(
    followedId: number,
    followerId: number,
  ): Promise<boolean> {
    const result = await this.db
      .select({ id: userFollows.followedId })
      .from(userFollows)
      .where(
        and(
          eq(userFollows.followedId, followedId),
          eq(userFollows.followerId, followerId),
        ),
      )
      .limit(1);
    return result.length > 0;
  }
}
