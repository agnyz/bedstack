import type { AuthService } from '@auth/auth.service';
import { AuthenticationError, BadRequestError } from '@errors';
import type { UsersRepository } from '@users/users.repository';
import type { UserInDb, UserToCreate, UserToUpdate } from '@users/users.schema';
import { NotFoundError } from 'elysia';

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
    return await this.generateUserResponse(user);
  }

  async createUser(user: UserToCreate) {
    user.password = await Bun.password.hash(user.password);
    const newUser = await this.repository.createUser(user);
    if (!newUser) {
      throw new BadRequestError('Email or username is already taken');
    }
    return await this.generateUserResponse(newUser);
  }

  async updateUser(id: number, user: UserToUpdate) {
    // Emails are unique, if the user is trying to change their email,
    // we need to check if the new email is already taken
    const currentUser = await this.repository.findById(id);
    if (!currentUser) {
      throw new NotFoundError('User not found');
    }
    if (user.email && user.email !== currentUser.email) {
      const userWithEmail = await this.repository.findByEmail(user.email);
      if (userWithEmail) {
        throw new BadRequestError('Email is already taken');
      }
    }

    if (user.password) user.password = await Bun.password.hash(user.password);
    const updatedUser = await this.repository.updateUser(currentUser.id, user);
    return await this.generateUserResponse(updatedUser);
  }

  async loginUser(email: string, password: string) {
    const user = await this.repository.findByEmail(email);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    if (!(await Bun.password.verify(password, user.password))) {
      throw new AuthenticationError('Invalid password');
    }
    return await this.generateUserResponse(user);
  }

  async generateUserResponse(user: UserInDb) {
    return {
      user: {
        email: user.email,
        bio: user.bio,
        image: user.image,
        username: user.username,
        token: await this.authService.generateToken(user),
      },
    };
  }
}
