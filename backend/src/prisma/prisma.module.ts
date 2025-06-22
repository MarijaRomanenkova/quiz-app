import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

/**
 * PrismaModule provides the PrismaService for database access
 *
 * This module exports the PrismaService so it can be injected into other modules
 * throughout the application for database operations using Prisma ORM.
 *
 * @module PrismaModule
 *
 * @example
 * ```typescript
 * import { PrismaModule } from './prisma/prisma.module';
 * @Module({ imports: [PrismaModule] })
 * export class SomeFeatureModule {}
 * ```
 */
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
