import type { UserFollowRow } from '@/users/interfaces/user-follow-row.interface';
import type { UserRow } from '@/users/interfaces/user-row.interface';

export type ProfileRow = UserRow & {
  followers: UserFollowRow[];
};
