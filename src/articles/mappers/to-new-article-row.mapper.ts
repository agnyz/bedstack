import { slugify } from '@/common/utils';
import type { CreateArticleInput, NewArticleRow } from '../interfaces';

export function toNewArticleRow(
  input: CreateArticleInput,
  authorId: number,
): NewArticleRow {
  return {
    ...input,
    slug: slugify(input.title),
    authorId,
  };
}
