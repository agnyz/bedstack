import { defineConfig } from 'drizzle-kit';

const dbCredentials = {
  host: process.env.POSTGRES_HOST || '0.0.0.0',
  port: Number.parseInt(process.env.POSTGRES_PORT || '5432'),
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  database: process.env.POSTGRES_DB || 'medium',
  ssl: false,
};

export const dbCredentialsString = `postgres://${dbCredentials.user}:${dbCredentials.password}@${dbCredentials.host}:${dbCredentials.port}/${dbCredentials.database}`;

export default defineConfig({
  out: './drizzle/migrations',
  // in our codebase, 'schema' refers to TypeBox objects (abstraction of a JSON schema), while 'model' refers to database entities/tables, which is what drizzle refers to as 'schema'
  schema: '**/*.schema.ts',
  breakpoints: false,
  dialect: 'postgresql',
  dbCredentials: dbCredentials,
  strict: true,
  // Redefine default migrations table and schema for the sake of clarity
  migrations: {
    table: '__drizzle_migrations',
    schema: 'drizzle',
  },
});
