import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { PrismaService } from '../prisma/prisma.service';

/**
 * HealthModule provides the health check endpoint for the API
 *
 * This module registers the HealthController and PrismaService to enable health monitoring
 * of the backend service.
 *
 * @module HealthModule
 *
 * @example
 * ```typescript
 * import { HealthModule } from './health/health.module';
 * @Module({ imports: [HealthModule] })
 * export class AppModule {}
 * ```
 */
@Module({
  controllers: [HealthController],
  providers: [PrismaService],
})
export class HealthModule {} 
