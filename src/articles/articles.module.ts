import { CommentsRepository } from '@/comments/comments.repository';
import { CommentsService } from '@/comments/comments.service';
import { db } from '@/database.providers';
import { ArticlesRepository } from '@articles/articles.repository';
import { ArticlesService } from '@articles/articles.service';
import { AuthService } from '@auth/auth.service';
import { ProfilesRepository } from '@profiles/profiles.repository';
import { ProfilesService } from '@profiles/profiles.service';
import { TagsRepository } from '@tags/tags.repository';
import { TagsService } from '@tags/tags.service';
import { UsersRepository } from '@users/users.repository';
import { Elysia } from 'elysia';

export const setupArticles = () => {
  const articlesRepository = new ArticlesRepository(db);
  const commentsRepository = new CommentsRepository(db);
  const profilesRepository = new ProfilesRepository(db);
  const usersRepository = new UsersRepository(db);
  const tagsRepositry = new TagsRepository(db);
  const profilesService = new ProfilesService(
    profilesRepository,
    usersRepository,
  );
  const tagsService = new TagsService(tagsRepositry);
  const articlesService = new ArticlesService(
    articlesRepository,
    profilesService,
    tagsService,
  );
  const commentsService = new CommentsService(
    commentsRepository,
    profilesService,
  );
  const authService = new AuthService();
  return new Elysia().state(() => ({
    articlesService,
    authService,
    commentsService,
  }));
};
