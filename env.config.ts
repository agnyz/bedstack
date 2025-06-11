import { Type } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';

const envSchema = Type.Object({
  POSTGRES_DB: Type.String(),
  POSTGRES_USER: Type.String(),
  POSTGRES_PASSWORD: Type.String(),
  POSTGRES_HOST: Type.String(),
  POSTGRES_PORT: Type.String(),
  JWT_SECRET: Type.String(),
  JWT_ALGORITHM: Type.String(),
});
// TODO: this is ugly, find a better way to do this
if (!Value.Check(envSchema, Bun.env)) throw new Error('Invalid env variables');
export const env = Value.Cast(envSchema, Bun.env);
