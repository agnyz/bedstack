/**
 * Base interface for API responses
 */
export type ApiResponse<T> = {
  data: T;
  message?: string;
};

/**
 * Interface for error responses
 */
export type ErrorResponse = {
  errors: {
    body: string[];
  };
};

/**
 * Interface for paginated API responses
 */
export type PaginatedApiResponse<T> = ApiResponse<{
  items: T[];
  total: number;
}>;

/**
 * Interface for API request context
 */
export type ApiContext = {
  userId?: number;
  headers: Headers;
  query: Record<string, string>;
  params: Record<string, string>;
  body: unknown;
};
