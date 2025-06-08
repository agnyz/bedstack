import { Elysia } from 'elysia';
import { TagsResponseDto } from './dto';
import { toResponse } from './mappers';
import { setupTags } from './tags.module';

export const tagsController = new Elysia().use(setupTags).group(
  '/tags',
  {
    detail: {
      tags: ['Tags'],
    },
  },
  (app) =>
    app.get(
      '/',
      async ({ store }) => {
        const tags = await store.tagsService.getTags();
        return toResponse(tags);
      },
      {
        response: TagsResponseDto,
        detail: {
          summary: 'Get Tags',
          description: 'No authentication required, returns a List of Tags',
        },
      },
    ),
);
