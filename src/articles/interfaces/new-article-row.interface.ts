import type { articles } from '@/articles/articles.schema';
import type { InferInsertModel } from 'drizzle-orm';

export type NewArticleRow = InferInsertModel<typeof articles>;
