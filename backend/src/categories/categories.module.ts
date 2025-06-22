import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { PrismaService } from '../prisma/prisma.service';

/**
 * CategoriesModule provides endpoints and services for learning categories
 *
 * This module registers the CategoriesController and CategoriesService to enable
 * category retrieval and management for the application. It also provides the PrismaService
 * for database access.
 *
 * @module CategoriesModule
 *
 * @example
 * ```typescript
 * import { CategoriesModule } from './categories/categories.module';
 * @Module({ imports: [CategoriesModule] })
 * export class AppModule {}
 * ```
 */
@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService, PrismaService],
  exports: [CategoriesService],
})
export class CategoriesModule {} 
