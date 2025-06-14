import type { InferNewRow } from '@/common/interfaces';
import type { InferSelectModel } from 'drizzle-orm';
import type { articleTags, tags } from '../tags.schema';

export type TagRow = InferSelectModel<typeof tags>;
export type NewTagRow = InferNewRow<typeof tags>;

export type ArticleTagRow = InferSelectModel<typeof articleTags>;
export type NewArticleTagRow = InferNewRow<typeof articleTags>;
