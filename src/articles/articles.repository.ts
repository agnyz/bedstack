import type { Database } from '@/database.providers';
import { userFollows, users } from '@/users/users.schema';
import { articleTags } from '@tags/tags.schema';
import { and, count, desc, eq, inArray, sql } from 'drizzle-orm';
import { articles, favoriteArticles } from './articles.schema';
import type {
  ArticleFeedRow,
  ArticleRow,
  NewArticleRow,
  UpdateArticleRow,
} from './interfaces';

type FindFilters = {
  tag?: string;
  author?: string;
  favorited?: string;
};

type FindOptions = {
  offset: number;
  limit: number;
  currentUserId?: number;
  followedAuthorIds?: number[];
};

export class ArticlesRepository {
  constructor(private readonly db: Database) {}

  async find(
    { author, tag, favorited }: FindFilters,
    { offset, limit, currentUserId, followedAuthorIds }: FindOptions,
  ): Promise<{ articles: ArticleFeedRow[]; articlesCount: number }> {
    const authorFilters = [];
    if (author) {
      authorFilters.push(eq(users.username, author));
    }

    if (followedAuthorIds?.length) {
      authorFilters.push(inArray(users.id, followedAuthorIds));
    }

    const baseQuery = this.db
      .select({
        slug: articles.slug,
        title: articles.title,
        description: articles.description,
        tagList: sql<string[]>`
          coalesce(
            array_agg(article_tags.tag_name order by article_tags.tag_name ASC)
            filter (where article_tags.tag_name is not null),
            '{}'::text[]
          )
        `.as('tagList'),
        createdAt: articles.createdAt,
        updatedAt: articles.updatedAt,
        favorited: sql<boolean>`
          coalesce(
            exists (
              select 1 from ${favoriteArticles}
              where ${favoriteArticles.articleId} = ${articles.id}
              and ${favoriteArticles.userId} = ${currentUserId ?? sql`null`}
            ),
            false
          )
        `.as('favorited'),
        favoritesCount:
          sql<number>`count(distinct favorite_articles.user_id)::integer`.as(
            'favoriteCount',
          ),
        author: {
          username: users.username,
          bio: users.bio,
          image: users.image,
          following: sql<boolean>`
            coalesce(
              exists (
                select 1 from ${userFollows}
                where ${userFollows.followedId} = ${users.id}
                and ${userFollows.followerId} = ${currentUserId ?? sql`null`}
              ),
              false
            )
          `.as('following'),
        },
      })
      .from(articles)
      .innerJoin(users, eq(users.id, articles.authorId))
      .leftJoin(articleTags, eq(articleTags.articleId, articles.id))
      .leftJoin(favoriteArticles, eq(favoriteArticles.articleId, articles.id));

    // Create a separate count query that only includes filtering conditions
    const countQuery = this.db
      .select({ id: articles.id })
      .from(articles)
      .innerJoin(users, eq(users.id, articles.authorId))
      .leftJoin(articleTags, eq(articleTags.articleId, articles.id))
      .leftJoin(favoriteArticles, eq(favoriteArticles.articleId, articles.id));

    // Apply tag filter if specified
    if (tag) {
      const tagFilter = and(
        ...authorFilters,
        sql`exists (
          select 1 from ${articleTags}
          where ${articleTags.articleId} = ${articles.id}
          and ${articleTags.tagName} = ${tag}
        )`,
      );
      baseQuery.where(tagFilter);
      countQuery.where(tagFilter);
    } else {
      // Only apply author filters if no tag filter
      const authorFilter = and(...authorFilters);
      baseQuery.where(authorFilter);
      countQuery.where(authorFilter);
    }

    // Apply favorited filter if specified
    if (favorited) {
      const favoritedByUser = await this.db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.username, favorited))
        .limit(1);

      if (!favoritedByUser[0]) {
        // If user doesn't exist, return no results
        return { articles: [], articlesCount: 0 };
      }

      const favoritedFilter = and(
        sql`exists (
          select 1 from ${favoriteArticles}
          where ${favoriteArticles.articleId} = ${articles.id}
          and ${favoriteArticles.userId} = ${favoritedByUser[0].id}
        )`,
      );
      baseQuery.where(favoritedFilter);
      countQuery.where(favoritedFilter);
    }

    const limitedResults = await baseQuery
      .groupBy(articles.id, users.id)
      .orderBy(desc(articles.createdAt))
      .limit(limit)
      .offset(offset);

    const resultsCount = await this.db
      .select({ count: count() })
      .from(countQuery.as('count_query'));

    return {
      articles: limitedResults,
      articlesCount: resultsCount[0].count,
    };
  }

  async findBySlug(slug: string): Promise<ArticleRow | null> {
    return (
      (await this.db.query.articles.findFirst({
        where: eq(articles.slug, slug),
        with: {
          author: {
            with: {
              followers: true,
            },
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

  /**
   * @param article - The article to create
   * @returns The created article or null if the article was not created successfully
   */
  async createArticle(article: NewArticleRow): Promise<ArticleRow | null> {
    const results = await this.db.insert(articles).values(article).returning();

    const newArticle = results[0];
    return await this.findById(newArticle.id);
  }

  /**
   * @param slug - The slug of the article to update
   * @param article - The article to update
   * @param currentUserId - The ID of the user updating the article
   * @returns The updated article or null if the article was not updated successfully
   */
  async updateArticle(
    slug: string,
    article: UpdateArticleRow,
    currentUserId: number,
  ): Promise<ArticleRow | null> {
    const results = await this.db
      .update(articles)
      .set({
        ...article,
        updatedAt: new Date(),
      })
      .where(and(eq(articles.slug, slug), eq(articles.authorId, currentUserId)))
      .returning();

    const updatedArticle = results[0];
    return await this.findById(updatedArticle.id);
  }

  async deleteArticle(slug: string, currentUserId: number): Promise<void> {
    await this.db
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
