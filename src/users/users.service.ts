import type { AuthService } from '@/auth/auth.service';
import { RealWorldError } from '@/common/errors';
import type { NewUserRow, UpdateUserRow, UserRow } from '@/users/interfaces';
import type { UsersRepository } from '@/users/users.repository';
import { NotFoundError } from 'elysia';
import { StatusCodes } from 'http-status-codes';
import { toDomain, toResponse } from './mappers';

export class UsersService {
  constructor(
    private readonly repository: UsersRepository,
    private readonly authService: AuthService,
  ) {}

  async findById(id: number) {
    const user = await this.repository.findById(id);
    if (!user) {
      throw new NotFoundError('user');
    }
    const token = await this.authService.generateToken(user);
    const domainUser = toDomain(user, token);
    return toResponse(domainUser);
  }

  async createUser(user: NewUserRow) {
    user.password = await Bun.password.hash(user.password);
    const newUser = await this.repository.createUser(user);
    if (!newUser) {
      throw new RealWorldError(StatusCodes.UNPROCESSABLE_ENTITY, {
        'user.email or user.username': ['already taken'],
      });
    }
    const token = await this.authService.generateToken(newUser);
    const domainUser = toDomain(newUser, token);
    return toResponse(domainUser);
  }

  async updateUser(id: number, user: UpdateUserRow) {
    // Emails are unique, if the user is trying to change their email,
    // we need to check if the new email is already taken
    const currentUser = await this.repository.findById(id);
    if (!currentUser) {
      throw new NotFoundError('user');
    }
    if (user.email && user.email !== currentUser.email) {
      const userWithEmail = await this.repository.findByEmail(user.email);
      if (userWithEmail) {
        throw new RealWorldError(StatusCodes.UNPROCESSABLE_ENTITY, {
          'user.email': ['already taken'],
        });
      }
    }

    if (user.password) user.password = await Bun.password.hash(user.password);
    const updatedUser = await this.repository.updateUser(currentUser.id, user);
    const token = await this.authService.generateToken(updatedUser);
    const domainUser = toDomain(updatedUser, token);
    return toResponse(domainUser);
  }

  async loginUser(email: string, password: string) {
    const user = await this.repository.findByEmail(email);
    if (!user) {
      throw new NotFoundError('user');
    }
    if (!(await Bun.password.verify(password, user.password))) {
      throw new RealWorldError(StatusCodes.UNAUTHORIZED, {
        user: ['invalid password'],
      });
    }
    const token = await this.authService.generateToken(user);
    const domainUser = toDomain(user, token);
    return toResponse(domainUser);
  }
}
