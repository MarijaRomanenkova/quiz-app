import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * JWT Authentication Guard for protecting routes
 *
 * This guard uses Passport's JWT strategy to authenticate requests by validating
 * JWT tokens in the Authorization header. Routes decorated with this guard will
 * only be accessible to authenticated users with valid JWT tokens.
 *
 * @class JwtAuthGuard
 * @extends AuthGuard
 *
 * @example
 * ```typescript
 * // Protect a controller
 * @Controller('protected')
 * @UseGuards(JwtAuthGuard)
 * export class ProtectedController {
 *   @Get()
 *   getProtectedData() {
 *     return 'This data is protected';
 *   }
 * }
 * 
 * // Protect a specific route
 * @Get('profile')
 * @UseGuards(JwtAuthGuard)
 * getProfile() {
 *   return this.userService.getProfile();
 * }
 * ```
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
