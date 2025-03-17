import { exit } from 'node:process';
import { db } from '@/database.providers';
import { userFollows, users } from '@users/users.model';
import { getTableName, sql } from 'drizzle-orm';

const tables = [users, userFollows];
console.log('Dropping all tables from the database');

try {
  // Use a transaction to ensure all deletions succeed or none do
  await db.transaction(async (tx) => {
    for (const table of tables) {
      const name = getTableName(table);
      console.log(`Dropping ${name}`);
      await tx.execute(
        sql`DROP TABLE IF EXISTS ${sql.identifier(name)} CASCADE;`,
      );
      console.log(`Dropped ${name}`);
    }
  });

  console.log('All tables dropped');

  exit(0);
} catch (error) {
  console.error('Failed to drop tables:', error);
  exit(1);
}
