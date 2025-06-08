import { exit } from 'node:process';
import { db } from '@/database.providers';
import { articles, favoriteArticles } from '@articles/articles.schema';
import { comments } from '@comments/comments.schema';
import dbConfig from '@db/config';
import { articleTags, tags } from '@tags/tags.schema';
import { userFollows, users } from '@users/users.model';
import { getTableName, sql } from 'drizzle-orm';

const tables = [
  articleTags,
  tags,
  userFollows,
  favoriteArticles,
  comments,
  articles,
  users,
];
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
    if (dbConfig.migrations?.table) {
      // Clean up migrations
      console.log('Dropping migrations table: ', dbConfig.migrations.table);
      await tx.execute(
        sql`DROP TABLE IF EXISTS ${sql.identifier(dbConfig.migrations.schema ?? 'public')}.${sql.identifier(dbConfig.migrations.table)} CASCADE;`,
      );
    }
  });

  console.log('All tables dropped');

  exit(0);
} catch (error) {
  console.error('Failed to drop tables:', error);
  exit(1);
}
