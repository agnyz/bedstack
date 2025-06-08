import type { TagsResponseDto } from '../dto';
import type { ITag } from '../interfaces';

export const toResponse = (tags: ITag[]): TagsResponseDto => ({
  tags: tags.map((tag) => tag.name),
});
