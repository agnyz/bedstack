import type { Database } from '@/database.providers';
import { users } from '@/users/users.schema';
import type { NewUserRow, UpdateUserRow, UserRow } from '@users/interfaces';
import { eq } from 'drizzle-orm';

export class UsersRepository {
  constructor(private readonly db: Database) {}

  async findAll() {
    return await this.db.query.users.findMany({
      with: { followers: true, following: true },
    });
  }

  async findById(id: number) {
    const result = await this.db.query.users.findFirst({
      where: eq(users.id, id),
    });
    if (!result) return null;
    return result;
  }

  async findByEmail(email: string) {
    const result = await this.db.query.users.findMany({
      where: eq(users.email, email),
    });
    if (result.length === 0) {
      return null;
    }
    if (result.length > 1) {
      throw new Error(`More than one user found with the same email: ${email}`);
    }
    return result[0];
  }

  async findByUsername(username: string) {
    const result = await this.db.query.users.findMany({
      where: eq(users.username, username),
    });
    if (result.length === 0) {
      return null;
    }
    if (result.length > 1) {
      throw new Error(
        `More than one user found with the same username: ${username}`,
      );
    }
    return result[0];
  }

  async createUser(user: NewUserRow) {
    const newUser = await this.db
      .insert(users)
      .values(user)
      .onConflictDoNothing()
      .returning();
    // returning returns the inserted row in an array, so we need to get the first element
    return newUser[0];
  }

  async updateUser(id: number, user: UpdateUserRow) {
    const updatedUser = await this.db
      .update(users)
      .set(user)
      .where(eq(users.id, id))
      .returning();
    return updatedUser[0];
  }
}
