import { env } from '@config';
import { AuthenticationError } from '@errors';
import { Type } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';
import type { UserInDb } from '@users/users.schema';
import * as jose from 'jose';

export class AuthService {
  private readonly ALG = env.JWT_ALGORITHM;
  private readonly JWT_SECRET = env.JWT_SECRET;

  get VerifiedJwtSchema() {
    return Type.Object({
      payload: Type.Object({
        user: Type.Object({
          id: Type.Number(),
          email: Type.String(),
          username: Type.String(),
        }),
        iat: Type.Number(),
        iss: Type.String(),
        aud: Type.String(),
        exp: Type.Number(),
      }),
      protectedHeader: Type.Object({
        alg: Type.Literal(this.ALG),
      }),
    });
  }

  generateToken = async (user: UserInDb) => {
    const encoder = new TextEncoder();
    const secret = encoder.encode(this.JWT_SECRET);

    return await new jose.SignJWT({
      user: { id: user.id, email: user.email, username: user.username },
    })
      .setProtectedHeader({ alg: this.ALG })
      .setIssuedAt()
      .setIssuer('agnyz')
      .setAudience(user.email)
      .setExpirationTime('24h')
      .sign(secret);
  };

  verifyToken = async (token: string) => {
    const encoder = new TextEncoder();
    const secret = encoder.encode(this.JWT_SECRET);

    let verifiedToken: jose.JWTVerifyResult;
    try {
      verifiedToken = await jose.jwtVerify(token, secret, {
        algorithms: [this.ALG],
      });
    } catch (err) {
      console.error(err);
      throw new AuthenticationError('Invalid token');
    }
    if (!Value.Check(this.VerifiedJwtSchema, verifiedToken))
      throw new AuthenticationError('Invalid token');
    const userToken = Value.Cast(this.VerifiedJwtSchema, verifiedToken);
    return userToken;
  };

  getUserFromHeaders = async (headers: Headers) => {
    const rawHeader = headers.get('Authorization');
    if (!rawHeader)
      throw new AuthenticationError('Missing authorization header');

    const tokenParts = rawHeader?.split(' ');
    const tokenType = tokenParts?.[0];
    if (tokenType !== 'Token')
      throw new AuthenticationError(
        "Invalid token type. Expected header format: 'Token jwt'",
      );

    const token = tokenParts?.[1];
    const userToken = await this.verifyToken(token);
    return userToken.payload.user;
  };

  requireLogin = async ({
    request: { headers },
  }: {
    request: Request;
  }) => {
    await this.getUserFromHeaders(headers);
  };

  getUserIdFromHeader = async (headers: Headers) => {
    const user = await this.getUserFromHeaders(headers);
    return user.id;
  };

  getOptionalUserIdFromHeader = async (headers: Headers) => {
    try {
      const user = await this.getUserFromHeaders(headers);
      return user.id;
    } catch (error) {
      if (error instanceof AuthenticationError) return undefined;
      throw error;
    }
  };
}
