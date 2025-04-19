import { AuthorizationError, BadRequestError } from '@/errors';
import type { ProfilesRepository } from '@/profiles/profiles.repository';
import { slugify } from '@/utils/slugify';
import type { ArticlesRepository } from '@articles/articles.repository';
import type { TagsService } from '@tags/tags.service';
import { NotFoundError } from 'elysia';
import type {
  Article,
  ArticleRow,
  CreateArticleInput,
  UpdateArticleInput,
} from './interfaces';
import {
  toDomain,
  toNewArticleRow,
  toResponse,
} from './mappers/articles.mapper';

export class ArticlesService {
  constructor(
    private readonly repository: ArticlesRepository,
    private readonly profilesRepository: ProfilesRepository,
    private readonly tagsService: TagsService,
  ) {}

  async find(
    filters: {
      tag?: string;
      author?: string;
      favorited?: string;
    },
    options: {
      pagination?: {
        offset?: number;
        limit?: number;
      };
      currentUserId?: number;
      personalization?: {
        /**
         * Whether to include articles from followed authors. If not specified, all articles will be returned
         */
        followedAuthors?: boolean;
      };
    } = {},
  ): Promise<{ articles: Article[]; articlesCount: number }> {
    const { pagination, currentUserId, personalization } = options;
    const { offset = 0, limit = 20 } = pagination ?? {};
    const { followedAuthors } = personalization ?? {};
    // TODO: should we check for currentUserId here, or throw an error?
    const followedAuthorIds =
      followedAuthors && currentUserId
        ? await this.profilesRepository.findFollowedUserIds(currentUserId)
        : undefined;
    const { articles, articlesCount } = await this.repository.find(filters, {
      offset,
      limit,
      currentUserId,
      followedAuthorIds,
    });
    return {
      articles: articles.map((article) => toDomain(article, { currentUserId })),
      articlesCount,
    };
  }

  async findBySlug(slug: string, currentUserId: number | null = null) {
    const article = await this.repository.findBySlug(slug);
    if (!article) {
      throw new NotFoundError('Article not found');
    }
    return toDomain(article, { currentUserId });
  }

  async createArticle(article: CreateArticleInput, currentUserId: number) {
    const newArticle = toNewArticleRow(article, currentUserId);

    const createdArticle = await this.repository.createArticle(newArticle);

    if (!createdArticle) {
      throw new BadRequestError('Article was not created');
    }

    if (article.tagList.length) {
      await this.tagsService.upsertArticleTags(
        createdArticle.id,
        article.tagList,
      );
    }

    return toDomain(createdArticle, { currentUserId });
  }

  async updateArticle(
    slug: string,
    article: UpdateArticleInput,
    currentUserId: number,
  ) {
    // TODO: Add transaction to ensure both or none of the operations are done
    const { tagList, ...articleData } = article;
    const existingArticle = await this.repository.findBySlug(slug);
    if (!existingArticle) {
      throw new NotFoundError('Article not found');
    }
    if (existingArticle.author.id !== currentUserId) {
      throw new AuthorizationError('Only the author can update the article');
    }

    const newSlug = articleData.title
      ? slugify(articleData.title)
      : existingArticle.slug;
    await this.repository.updateArticle(
      existingArticle.id,
      { ...articleData, slug: newSlug },
      currentUserId,
    );

    if (tagList) {
      await this.tagsService.upsertArticleTags(existingArticle.id, tagList);
    }

    return this.findBySlug(newSlug, currentUserId);
  }

  async deleteArticle(slug: string, currentUserId: number) {
    const article = await this.repository.findBySlug(slug);
    if (!article) {
      throw new NotFoundError('Article not found');
    }
    if (article.author.id !== currentUserId) {
      throw new AuthorizationError('Only the author can delete the article');
    }

    // articleTags will be deleted as well due to the cascade rule
    await this.repository.deleteArticle(slug, currentUserId);
    return {
      message: 'Article deleted',
      slug: article.slug,
    };
  }

  async favoriteArticle(slug: string, currentUserId: number) {
    const article = await this.repository.favoriteArticle(slug, currentUserId);
    if (!article) {
      throw new NotFoundError('Article not found');
    }
    return toDomain(article, { currentUserId });
  }

  async unfavoriteArticle(slug: string, currentUserId: number) {
    const article = await this.repository.unfavoriteArticle(
      slug,
      currentUserId,
    );
    if (!article) {
      throw new NotFoundError('Article not found');
    }
    return toDomain(article, { currentUserId });
  }
}
