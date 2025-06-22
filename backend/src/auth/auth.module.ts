import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PrismaModule } from '../prisma/prisma.module';

/**
 * Authentication module that provides JWT-based authentication
 *
 * This module configures all authentication-related services, controllers, and strategies.
 * It sets up JWT token generation, validation, and user authentication functionality.
 *
 * @module AuthModule
 *
 * @example
 * ```typescript
 * import { AuthModule } from './auth/auth.module';
 * 
 * @Module({
 *   imports: [AuthModule],
 *   // ... other module configuration
 * })
 * export class AppModule {}
 * ```
 */
@Module({
  imports: [
    // Database access for user operations
    PrismaModule,
    
    // Passport authentication framework
    PassportModule,
    
    // JWT token configuration with environment-based secret
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' }, // Tokens expire after 1 day
      }),
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService], // Export AuthService for use in other modules
})
export class AuthModule {}
