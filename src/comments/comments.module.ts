import { ArticlesRepository } from '@/articles/articles.repository';
import { ArticlesService } from '@/articles/articles.service';
import { AuthService } from '@/auth/auth.service';
import { db } from '@/database/database.providers';
import { ProfilesRepository } from '@/profiles/profiles.repository';
import { ProfilesService } from '@/profiles/profiles.service';
import { TagsRepository } from '@/tags/tags.repository';
import { TagsService } from '@/tags/tags.service';
import { Elysia } from 'elysia';
import { CommentsRepository } from './comments.repository';
import { CommentsService } from './comments.service';

export const setupComments = () => {
  const commentsRepository = new CommentsRepository(db);
  const articlesRepository = new ArticlesRepository(db);
  const profilesRepository = new ProfilesRepository(db);
  const tagsRepository = new TagsRepository(db);
  const profilesService = new ProfilesService(profilesRepository);
  const tagsService = new TagsService(tagsRepository);
  const articlesService = new ArticlesService(
    articlesRepository,
    profilesService,
    tagsService,
  );
  const commentsService = new CommentsService(
    commentsRepository,
    articlesService,
    profilesService,
  );
  const authService = new AuthService();
  return new Elysia().state(() => ({
    commentsService,
    authService,
  }));
};
