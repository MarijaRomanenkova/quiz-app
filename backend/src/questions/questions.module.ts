import { Module } from '@nestjs/common';
import { QuestionsController } from './questions.controller';
import { QuestionsService } from './questions.service';
import { PrismaModule } from '../prisma/prisma.module';

/**
 * QuestionsModule provides endpoints and services for quiz questions
 *
 * This module registers the QuestionsController and QuestionsService to enable
 * question retrieval and management for the application. It imports the PrismaModule
 * for database access.
 *
 * @module QuestionsModule
 *
 * @example
 * ```typescript
 * import { QuestionsModule } from './questions/questions.module';
 * @Module({ imports: [QuestionsModule] })
 * export class AppModule {}
 * ```
 */
@Module({
  imports: [PrismaModule],
  controllers: [QuestionsController],
  providers: [QuestionsService],
  exports: [QuestionsService],
})
export class QuestionsModule {} 
