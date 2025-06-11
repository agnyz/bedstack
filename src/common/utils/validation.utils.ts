/**
 * Checks if a string is empty or only contains whitespace
 * @param str - The string to check
 * @returns Whether the string is empty or only contains whitespace
 * @example
 * isEmptyString('') // true
 * isEmptyString('   ') // true
 * isEmptyString('hello') // false
 */
export const isEmptyString = (str: string): boolean => {
  return str.trim().length === 0;
};

/**
 * Checks if a value is null or undefined
 * @param value - The value to check
 * @returns Whether the value is null or undefined
 * @example
 * isNullOrUndefined(null) // true
 * isNullOrUndefined(undefined) // true
 * isNullOrUndefined('') // false
 */
export const isNullOrUndefined = (
  value: unknown,
): value is null | undefined => {
  return value === null || value === undefined;
};

/**
 * Checks if a value is a valid email address
 * @param email - The email to check
 * @returns Whether the email is valid
 * @example
 * isValidEmail('user@example.com') // true
 * isValidEmail('invalid') // false
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Checks if a value is a valid URL
 * @param url - The URL to check
 * @returns Whether the URL is valid
 * @example
 * isValidUrl('https://example.com') // true
 * isValidUrl('invalid') // false
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};
