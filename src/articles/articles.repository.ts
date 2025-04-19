import type { Database } from '@/database.providers';
import { articleTags } from '@tags/tags.model';
import { userFollows, users } from '@users/users.model';
import { and, count, desc, eq, inArray, sql } from 'drizzle-orm';
import { articles, favoriteArticles } from './articles.schema';
import type {
  ArticleFeedRow,
  ArticleRow,
  NewArticleRow,
  UpdateArticleRow,
} from './interfaces';

export class ArticlesRepository {
  constructor(private readonly db: Database) {}

  async find(
    filters: {
      tag?: string;
      author?: string;
      favorited?: string;
    },
    options: {
      offset: number;
      limit: number;
      currentUserId?: number;
      followedAuthorIds?: number[];
    },
  ): Promise<{ articles: ArticleFeedRow[]; articlesCount: number }> {
    const { author, tag, favorited } = filters;
    const { offset, limit, currentUserId, followedAuthorIds } = options;

    const authorFilters = [];
    if (author) {
      authorFilters.push(eq(users.username, author));
    }

    if (followedAuthorIds?.length) {
      authorFilters.push(inArray(users.id, followedAuthorIds));
    }

    const authorsWithFollowersCTE = this.db.$with('authorsWithFollowers').as(
      this.db
        .select({
          authorId: users.id,
          authorUsername: users.username,
          authorBio: users.bio,
          authorImage: users.image,
          authorFollowing:
            sql<boolean>`coalesce(${currentUserId} = any(array_agg(user_follows.follower_id)), false)`.as(
              'authorFollowing',
            ),
        })
        .from(users)
        .leftJoin(userFollows, eq(users.id, userFollows.followedId))
        .where(and(...authorFilters))
        .groupBy(users.id),
    );

    const articleFilters = [];
    if (favorited) {
      articleFilters.push(eq(users.username, favorited));
    }

    const articlesWithLikesCTE = this.db.$with('articlesWithLikes').as(
      this.db
        .select({
          articleId: articles.id,
          favorited:
            sql<boolean>`coalesce(${currentUserId} = any(array_agg(favorite_articles.user_id)), false)`.as(
              'favorited',
            ),
          favoriteCount: sql<number>`count(*)::integer`.as('favoriteCount'),
        })
        .from(articles)
        .leftJoin(favoriteArticles, eq(favoriteArticles.articleId, articles.id))
        .leftJoin(users, eq(users.id, favoriteArticles.userId))
        .where(and(...articleFilters))
        .groupBy(articles.id),
    );

    const articlesWithTagsCTE = this.db.$with('articlesWithTags').as(
      this.db
        .select({
          articleId: articles.id,
          tags: sql<string[]>`
            array_agg(article_tags.tag_name order by article_tags.tag_name ASC)
            filter (where article_tags.tag_name is not null)
          `.as('tags'),
        })
        .from(articles)
        .innerJoin(users, eq(users.id, articles.authorId))
        .leftJoin(articleTags, eq(articleTags.articleId, articles.id))
        .where(and(...authorFilters, ...articleFilters))
        .groupBy(articles.id)
        // Having can't be used with aliases, the calculation must be repeated
        .having(
          tag ? sql`${tag} = any(array_agg(article_tags.tag_name))` : sql`true`,
        ),
    );

    const resultsQuery = this.db
      .with(authorsWithFollowersCTE, articlesWithLikesCTE, articlesWithTagsCTE)
      .select({
        slug: articles.slug,
        title: articles.title,
        description: articles.description,
        // Case-when is not natively suppoerted yet
        // https://github.com/drizzle-team/drizzle-orm/issues/1065
        tagList: sql<string[]>`
          case 
            when ${articlesWithTagsCTE.tags} is not null then ${articlesWithTagsCTE.tags}
            else '{}'::text[]
          end
          `.as('tagList'),
        createdAt: articles.createdAt,
        updatedAt: articles.updatedAt,
        favorited: articlesWithLikesCTE.favorited,
        favoritesCount: articlesWithLikesCTE.favoriteCount,
        author: {
          username: authorsWithFollowersCTE.authorUsername,
          bio: authorsWithFollowersCTE.authorBio,
          image: authorsWithFollowersCTE.authorImage,
          following: authorsWithFollowersCTE.authorFollowing,
        },
      })
      .from(articles)
      .innerJoin(
        articlesWithLikesCTE,
        eq(articlesWithLikesCTE.articleId, articles.id),
      )
      .innerJoin(
        authorsWithFollowersCTE,
        eq(authorsWithFollowersCTE.authorId, articles.authorId),
      )
      .innerJoin(
        articlesWithTagsCTE,
        eq(articlesWithTagsCTE.articleId, articles.id),
      )
      .orderBy(desc(articles.createdAt))
      .as('results');

    const limitedResults = await this.db
      .select()
      .from(resultsQuery)
      .limit(limit)
      .offset(offset);

    const resultsCount = await this.db
      .select({ count: count() })
      .from(resultsQuery);

    return { articles: limitedResults, articlesCount: resultsCount[0].count };
  }

  async findBySlug(slug: string): Promise<ArticleRow | null> {
    return (
      (await this.db.query.articles.findFirst({
        where: eq(articles.slug, slug),
        with: {
          author: {
            with: { followers: true },
          },
          favoritedBy: true,
          tags: true,
        },
      })) ?? null
    );
  }

  async findById(id: number): Promise<ArticleRow | null> {
    const result = await this.db.query.articles.findFirst({
      where: eq(articles.id, id),
      with: {
        author: {
          with: {
            followers: true,
          },
        },
        favoritedBy: true,
        tags: true,
      },
    });
    return result ?? null;
  }

  async createArticle(article: NewArticleRow) {
    const results = await this.db.insert(articles).values(article).returning();
    const newArticle = results[0];
    return this.findById(newArticle.id);
  }

  async updateArticle(
    articleId: number,
    article: UpdateArticleRow,
    currentUserId: number,
  ) {
    const filteredArticle = Object.fromEntries(
      Object.entries(article).filter(([_, value]) => value !== undefined),
    );
    await this.db
      .update(articles)
      .set({
        ...filteredArticle,
        updatedAt: new Date(),
      })
      .where(
        and(eq(articles.id, articleId), eq(articles.authorId, currentUserId)),
      );
  }

  async deleteArticle(slug: string, currentUserId: number) {
    return await this.db
      .delete(articles)
      .where(
        and(eq(articles.slug, slug), eq(articles.authorId, currentUserId)),
      );
  }

  async favoriteArticle(slug: string, currentUserId: number) {
    // TODO: Use a transaction to optimize from 1-3 ops to 1 op
    const article = await this.findBySlug(slug);
    if (!article) {
      return null;
    }

    // Insert the favorite and get the updated article state
    await this.db
      .insert(favoriteArticles)
      .values({ articleId: article.id, userId: currentUserId })
      .onConflictDoNothing();

    // Return the updated article state
    return this.findBySlug(slug);
  }

  async unfavoriteArticle(slug: string, currentUserId: number) {
    // TODO: Use a transaction to optimize from 1-3 ops to 1 op
    const article = await this.findBySlug(slug);
    if (!article) {
      return null;
    }

    // Delete the favorite and get the updated article state
    await this.db
      .delete(favoriteArticles)
      .where(
        and(
          eq(favoriteArticles.articleId, article.id),
          eq(favoriteArticles.userId, currentUserId),
        ),
      );

    // Return the updated article state
    return this.findBySlug(slug);
  }
}
