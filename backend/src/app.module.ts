import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { TopicsModule } from './topics/topics.module';
import { QuestionsModule } from './questions/questions.module';
import { ReadingTextsModule } from './reading-texts/reading-texts.module';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './health/health.module';

/**
 * Root application module that configures all feature modules and global providers
 * 
 * This module serves as the entry point for the NestJS application and imports
 * all necessary feature modules including authentication, categories, topics,
 * questions, reading texts, and health monitoring.
 * 
 * @module AppModule
 * 
 * @example
 * ```typescript
 * import { AppModule } from './app.module';
 * 
 * const app = await NestFactory.create(AppModule);
 * ```
 */
@Module({
  imports: [
    // Global configuration module for environment variables
    ConfigModule.forRoot({
      isGlobal: true, // Make config available throughout the app
    }),
    
    // Database module for Prisma ORM
    PrismaModule,
    
    // Feature modules
    AuthModule,
    CategoriesModule,
    TopicsModule,
    QuestionsModule,
    ReadingTextsModule,
    HealthModule,
  ],
})
export class AppModule {}
