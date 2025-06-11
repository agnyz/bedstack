/**
 * Formats a date to ISO string format
 * @param date - The date to format
 * @returns The formatted date string
 * @example
 * formatDateToISO(new Date()) // '2024-03-14T12:00:00.000Z'
 */
export const formatDateToISO = (date: Date): string => {
  return date.toISOString();
};

/**
 * Checks if a date is valid
 * @param date - The date to check
 * @returns Whether the date is valid
 * @example
 * isValidDate(new Date()) // true
 * isValidDate(new Date('invalid')) // false
 */
export const isValidDate = (date: Date): boolean => {
  return date instanceof Date && !Number.isNaN(date.getTime());
};

/**
 * Gets the current date in ISO format
 * @returns The current date in ISO format
 * @example
 * getCurrentDateISO() // '2024-03-14T12:00:00.000Z'
 */
export const getCurrentDateISO = (): string => {
  return new Date().toISOString();
};
