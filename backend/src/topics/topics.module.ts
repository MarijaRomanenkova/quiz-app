import { Module } from '@nestjs/common';
import { TopicsController } from './topics.controller';
import { TopicsService } from './topics.service';
import { PrismaService } from '../prisma/prisma.service';

/**
 * TopicsModule provides endpoints and services for learning topics
 *
 * This module registers the TopicsController and TopicsService to enable
 * topic retrieval and management for the application. It also provides the PrismaService
 * for database access.
 *
 * @module TopicsModule
 *
 * @example
 * ```typescript
 * import { TopicsModule } from './topics/topics.module';
 * @Module({ imports: [TopicsModule] })
 * export class AppModule {}
 * ```
 */
@Module({
  controllers: [TopicsController],
  providers: [TopicsService, PrismaService],
  exports: [TopicsService],
})
export class TopicsModule {} 
