/**
 * Default limit for pagination (number of items per request)
 */
export const DEFAULT_LIMIT = 20;

/**
 * Maximum number of items that can be returned in a single request.
 *
 * Set to 100 since the article body is not returned and the returned articles are small
 */
export const MAX_LIMIT = 100;

/**
 * Minimum number of items that can be requested in a single request
 */
export const MIN_LIMIT = 1;

/**
 * Default offset for pagination.
 *
 * Note: This codebase uses offset-based pagination rather than page-based pagination
 * for better performance and consistency with the API specification.
 */
export const DEFAULT_OFFSET = 0;

/**
 * Minimum offset for pagination
 */
export const MIN_OFFSET = 0;
