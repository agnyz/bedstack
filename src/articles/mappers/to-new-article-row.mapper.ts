import { slugify } from '@utils/slugify';
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
