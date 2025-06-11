import { AuthService } from '@/auth/auth.service';
import { db } from '@/database/database.providers';
import { UsersRepository } from '@/users/users.repository';
import { UsersService } from '@/users/users.service';
import { Elysia } from 'elysia';

export const setupUsers = () => {
  const usersRepository = new UsersRepository(db);
  const authService = new AuthService();
  const usersService = new UsersService(usersRepository, authService);
  return new Elysia().state(() => ({ usersService, authService }));
};
