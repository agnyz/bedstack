import type { AuthService } from '@auth/auth.service';
import { AuthenticationError, BadRequestError } from '@errors';
import type {
  CreateUserInput,
  IUser,
  UpdateUserInput,
} from '@users/interfaces';
import type { UsersRepository } from '@users/users.repository';
import { NotFoundError } from 'elysia';
import { toDomain, toNewUserRow, toResponse, toUpdateUserRow } from './mappers';

export class UsersService {
  constructor(
    private readonly repository: UsersRepository,
    private readonly authService: AuthService,
  ) {}

  async findById(id: number) {
    const user = await this.repository.findById(id);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    const token = await this.authService.generateToken(user);
    const domainUser = toDomain(user, token);
    return toResponse(domainUser);
  }

  async createUser(input: CreateUserInput) {
    const newUser = toNewUserRow(input);
    newUser.password = await Bun.password.hash(newUser.password);
    const createdUser = await this.repository.createUser(newUser);
    if (!createdUser) {
      throw new BadRequestError('Email or username is already taken');
    }
    const token = await this.authService.generateToken(createdUser);
    const domainUser = toDomain(createdUser, token);
    return toResponse(domainUser);
  }

  async updateUser(id: number, input: UpdateUserInput) {
    // Emails are unique, if the user is trying to change their email,
    // we need to check if the new email is already taken
    const currentUser = await this.repository.findById(id);
    if (!currentUser) {
      throw new NotFoundError('User not found');
    }
    if (input.email && input.email !== currentUser.email) {
      const userWithEmail = await this.repository.findByEmail(input.email);
      if (userWithEmail) {
        throw new BadRequestError('Email is already taken');
      }
    }

    const updateUser = toUpdateUserRow(input);
    if (updateUser.password) {
      updateUser.password = await Bun.password.hash(updateUser.password);
    }
    const updatedUser = await this.repository.updateUser(
      currentUser.id,
      updateUser,
    );
    const token = await this.authService.generateToken(updatedUser);
    const domainUser = toDomain(updatedUser, token);
    return toResponse(domainUser);
  }

  async loginUser(email: string, password: string) {
    const user = await this.repository.findByEmail(email);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    if (!(await Bun.password.verify(password, user.password))) {
      throw new AuthenticationError('Invalid password');
    }
    const token = await this.authService.generateToken(user);
    const domainUser = toDomain(user, token);
    return toResponse(domainUser);
  }
}
