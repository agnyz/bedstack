/**
 * Base interface for all entities
 */
export type BaseEntity = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Interface for pagination parameters
 */
export type PaginationParams = {
  offset?: number;
  limit?: number;
};

/**
 * Interface for paginated results
 */
export type PaginatedResult<T> = {
  items: T[];
  total: number;
};

/**
 * Interface for sorting parameters
 */
export type SortParams = {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
};

/**
 * Interface for filtering parameters
 */
export type FilterParams = {
  [key: string]: string | number | boolean | undefined;
};
