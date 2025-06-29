import { Injectable, ExecutionContext, Logger } from '@nestjs/common';
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
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    
    this.logger.log(`JWT Guard - Authorization header: ${authHeader ? 'Present' : 'Missing'}`);
    if (authHeader) {
      this.logger.log(`JWT Guard - Token: ${authHeader.substring(0, 20)}...`);
    }
    
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    this.logger.log(`JWT Guard - handleRequest called`);
    this.logger.log(`JWT Guard - Error: ${err ? err.message : 'None'}`);
    this.logger.log(`JWT Guard - User: ${user ? user.id : 'None'}`);
    this.logger.log(`JWT Guard - Info: ${info ? info.message : 'None'}`);
    
    if (err || !user) {
      this.logger.error(`JWT Guard - Authentication failed: ${err?.message || info?.message || 'No user'}`);
    }
    
    return super.handleRequest(err, user, info, context);
  }
}
