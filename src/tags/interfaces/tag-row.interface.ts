import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import type { articleTags, tags } from '../tags.schema';

export type TagRow = InferSelectModel<typeof tags>;
export type NewTagRow = InferInsertModel<typeof tags>;

export type ArticleTagRow = InferSelectModel<typeof articleTags>;
export type NewArticleTagRow = InferInsertModel<typeof articleTags>;
