import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

/**
 * JWT Strategy for Passport authentication
 *
 * This strategy handles JWT token validation and user extraction from tokens.
 * It extracts the JWT from the Authorization header, validates it using the secret key,
 * and retrieves the corresponding user from the database.
 *
 * @class JwtStrategy
 * @extends PassportStrategy
 *
 * @example
 * ```typescript
 * // The strategy is automatically used by JwtAuthGuard
 * @UseGuards(JwtAuthGuard)
 * async getProfile(@Request() req) {
 *   // req.user will contain the user object from the JWT
 *   return req.user;
 * }
 * ```
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    super({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  /**
   * Validates JWT payload and returns user data
   *
   * This method is called by Passport after JWT validation to extract user information
   * from the token payload and optionally fetch additional user data from the database.
   *
   * @param payload - The decoded JWT payload containing user information
   * @returns Promise containing user data or null if user not found
   *
   * @example
   * ```typescript
   * // JWT payload structure
   * const payload = {
   *   sub: 'user-id',
   *   email: 'user@example.com',
   *   iat: 1234567890,
   *   exp: 1234567890
   * };
   * ```
   */
  async validate(payload: { sub: string; email: string }) {
    // JWT Strategy - Received payload
    
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });
    
    // JWT Strategy - Found user
    
    if (!user) {
      return null;
    }
    
    // Return the user object with id property for controllers
    return {
      id: user.id,
      email: user.email,
    };
  }
}
