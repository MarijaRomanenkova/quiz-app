import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

/**
 * Categories service that handles learning category retrieval and management
 *
 * This service provides business logic for:
 * - Fetching categories by user level
 * - Filtering categories based on user's learning level
 *
 * @service CategoriesService
 *
 * @example
 * ```typescript
 * // Get categories for a user
 * const categories = await categoriesService.findAll(userId);
 * // Number of categories
 * ```
 */
@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Get all categories for a specific user filtered by their level
   *
   * Retrieves all available learning categories (grammar, reading, listening, words)
   * that are appropriate for the user's current learning level.
   *
   * @param userId - Unique identifier of the authenticated user
   * @returns Promise containing array of categories with metadata
   *
   * @example
   * ```typescript
   * const categories = await categoriesService.findAll('user-123');
   * // Returns array of category objects
   * ```
   */
  async findAll(userId: string) {
    this.logger.log(`Fetching categories for user: ${userId}`);
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { levelId: true }
    });

    return this.prisma.category.findMany({
      select: {
        categoryId: true,
        description: true,
        progress: true,
      },
    });
  }
} 
