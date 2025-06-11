/**
 * See https://realworld-docs.netlify.app/specifications/backend/error-handling/
 */
export class RealWorldError extends Error {
  constructor(
    public statusCode: number,
    public errors: Record<string, string[]>,
  ) {
    super(JSON.stringify(errors));
    this.name = 'RealWorldError';
  }
}
