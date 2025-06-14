import type { CreateArticleDto } from '../dto';
import type { CreateArticleInput } from '../interfaces';

export function toCreateArticleInput({
  article,
}: CreateArticleDto): CreateArticleInput {
  return {
    title: article.title,
    description: article.description,
    body: article.body,
    tagList: article.tagList ?? [],
  };
}
