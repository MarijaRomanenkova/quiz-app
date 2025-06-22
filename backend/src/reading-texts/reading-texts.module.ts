import { Module } from '@nestjs/common';
import { ReadingTextsController } from './reading-texts.controller';
import { ReadingTextsService } from './reading-texts.service';
import { PrismaModule } from '../prisma/prisma.module';

/**
 * ReadingTextsModule provides endpoints and services for reading texts
 *
 * This module registers the ReadingTextsController and ReadingTextsService to enable
 * reading text retrieval and management for the application. It imports the PrismaModule
 * for database access.
 *
 * @module ReadingTextsModule
 *
 * @example
 * ```typescript
 * import { ReadingTextsModule } from './reading-texts/reading-texts.module';
 * @Module({ imports: [ReadingTextsModule] })
 * export class AppModule {}
 * ```
 */
@Module({
  imports: [PrismaModule],
  controllers: [ReadingTextsController],
  providers: [ReadingTextsService],
  exports: [ReadingTextsService],
})
export class ReadingTextsModule {} 
