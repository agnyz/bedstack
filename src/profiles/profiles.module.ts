import { db } from '@/database.providers';
import { AuthService } from '@auth/auth.service';
import { ProfilesRepository } from '@profiles/profiles.repository';
import { ProfilesService } from '@profiles/profiles.service';
import { Elysia } from 'elysia';

export const setupProfiles = () => {
  const profilesRepository = new ProfilesRepository(db);
  const profilesService = new ProfilesService(profilesRepository);
  const authService = new AuthService();
  return new Elysia().state(() => ({ profilesService, authService }));
};
