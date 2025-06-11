import type { NotFoundError, ValidationError } from 'elysia';

export function isHttpError(err: unknown): err is { code: number } {
  return (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    typeof err.code === 'number'
  );
}

// Defined temporarily until Elysia exports the type
type ElysiaCustomStatusResponse = {
  code: number;
  response: string;
};

export function isElysiaError(err: unknown): err is ElysiaCustomStatusResponse {
  return (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    'response' in err
  );
}

/**
 * Turn "/user/email" into "user.email"
 * @param path
 * @returns
 */
function parsePath(path: string): string {
  return path
    .replace(/^\//, '') // remove leading slash
    .replace(/\//g, '.') // convert slash to dot notation
    .replace(/\[(\d+)\]/g, '.$1'); // optional: convert [0] to .0
}

export function formatValidationError(error: ValidationError) {
  if (error.all.length === 0) {
    return {
      errors: {
        [error.type ?? 'body']: 'Invalid value',
      },
    };
  }
  const result: Record<string, string[]> = {};

  for (const err of error.all) {
    const path = 'path' in err ? parsePath(err.path) : 'general';
    let message =
      'schema' in err
        ? (err.schema.description ?? err.summary ?? 'Invalid value')
        : (err.summary ?? 'Invalid value');

    // 🧼 Remove redundant prefix: "Property 'user.image' should be ..."
    message = message.replace(/^Property '.*?' should /i, 'should ');

    if (!result[path]) {
      result[path] = [];
    }

    result[path].push(message);
  }

  // Remove duplicates in each path’s messages
  for (const path in result) {
    result[path] = [...new Set(result[path])];
  }

  return { errors: result };
}

export function formatNotFoundError(error: NotFoundError) {
  return {
    errors: {
      [error.message.toLowerCase()]: 'not found',
    },
  };
}
