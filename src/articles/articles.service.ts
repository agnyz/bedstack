import type { ArticlesRepository } from '@articles/articles.repository';
import { AuthorizationError, BadRequestError, ConflictError } from '@errors';
import type { ProfilesService } from '@profiles/profiles.service';
import type { TagsService } from '@tags/tags.service';
import { slugify } from '@utils/slugify';
import { NotFoundError } from 'elysia';
import type {
  CreateArticleInput,
  IArticle,
  IArticleFeed,
  UpdateArticleInput,
} from './interfaces';
import { toDomain, toFeedDomain, toNewArticleRow } from './mappers';

type FindFilters = {
  tag?: string;
  author?: string;
  favorited?: string;
};

type PersonalizationOptions = {
  /**
   * Whether to include articles from followed authors. If not specified, all articles will be returned
   */
  followedAuthors?: boolean;
};

type PaginationOptions = {
  offset?: number;
  limit?: number;
};

type FindOptions = {
  pagination?: PaginationOptions;
  currentUserId?: number;
  personalization?: PersonalizationOptions;
};

export class ArticlesService {
  constructor(
    private readonly repository: ArticlesRepository,
    private readonly profilesService: ProfilesService,
    private readonly tagsService: TagsService,
  ) {}

  async find(
    filters: FindFilters,
    options: FindOptions = {},
  ): Promise<{ articles: IArticleFeed[]; articlesCount: number }> {
    const { pagination, currentUserId, personalization } = options;
    const { offset = 0, limit = 20 } = pagination ?? {};
    const { followedAuthors } = personalization ?? {};

    const followedAuthorIds =
      followedAuthors && currentUserId
        ? await this.profilesService.findFollowedUserIds(currentUserId)
        : undefined;

    const { articles, articlesCount } = await this.repository.find(filters, {
      offset,
      limit,
      currentUserId,
      followedAuthorIds,
    });

    return {
      articles: articles.map((article) => toFeedDomain(article)),
      articlesCount,
    };
  }

  async findBySlug(
    slug: string,
    currentUserId: number | null = null,
  ): Promise<IArticle> {
    const article = await this.repository.findBySlug(slug);
    if (!article) {
      throw new NotFoundError('Article not found');
    }
    return toDomain(article, { currentUserId: currentUserId ?? undefined });
  }

  async createArticle(
    article: CreateArticleInput,
    currentUserId: number,
  ): Promise<IArticle> {
    const newArticle = toNewArticleRow(article, currentUserId);

    // TODO: This can cause a race condition if two users create an article with the same title at the same time
    // Solve this in db layer using a transaction

    // Check if any article exists with this title
    const existingArticle = await this.repository.findBySlug(newArticle.slug);
    if (existingArticle) {
      throw new ConflictError(
        'An article with this slug already exists. Please use a unique title',
      );
    }

    const createdArticle = await this.repository.createArticle(newArticle);

    if (!createdArticle) {
      throw new BadRequestError('Article was not created');
    }

    let { tagList } = article;
    if (article.tagList.length) {
      const upsertArticleTagsResult = await this.tagsService.upsertArticleTags(
        createdArticle.id,
        article.tagList,
      );
      if (upsertArticleTagsResult) {
        tagList = upsertArticleTagsResult.map((t) => t.tagName);
      }
    }

    return toDomain(createdArticle, {
      currentUserId: currentUserId ?? undefined,
      tagList,
    });
  }

  async updateArticle(
    slug: string,
    article: UpdateArticleInput,
    currentUserId: number,
  ): Promise<IArticle> {
    const existingArticle = await this.repository.findBySlug(slug);
    if (!existingArticle) {
      throw new NotFoundError('Article not found');
    }
    if (existingArticle.author.id !== currentUserId) {
      throw new AuthorizationError('Only the author can update the article');
    }

    // TODO: This can cause a race condition if two users update an article with the same title at the same time
    // Solve this in db layer using a transaction

    // If title is being updated, check if the new slug would conflict
    if (article.title) {
      const newSlug = slugify(article.title);
      const articleWithNewSlug = await this.repository.findBySlug(newSlug);
      if (articleWithNewSlug && articleWithNewSlug.id !== existingArticle.id) {
        throw new ConflictError(
          'An article with this slug already exists. Please use a unique title',
        );
      }
    }

    const updatedArticle = await this.repository.updateArticle(
      slug,
      {
        ...article,
        slug: article.title ? slugify(article.title) : undefined,
      },
      currentUserId,
    );

    if (!updatedArticle) {
      throw new BadRequestError('Article was not updated');
    }

    let { tagList } = article;
    if (tagList) {
      const upsertArticleTagsResult = await this.tagsService.upsertArticleTags(
        updatedArticle.id,
        tagList,
      );
      if (upsertArticleTagsResult) {
        tagList = upsertArticleTagsResult.map((t) => t.tagName);
      }
    }

    return toDomain(updatedArticle, {
      currentUserId,
      tagList,
    });
  }

  async deleteArticle(slug: string, currentUserId: number): Promise<void> {
    const article = await this.repository.findBySlug(slug);
    if (!article) {
      throw new NotFoundError('Article not found');
    }
    if (article.author.id !== currentUserId) {
      throw new AuthorizationError('Only the author can delete the article');
    }

    await this.repository.deleteArticle(slug, currentUserId);
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
