import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

/**
 * Topics service that handles topic retrieval and management
 *
 * This service provides business logic for:
 * - Fetching topics by category and user level
 * - Filtering topics based on user's learning level
 * - Sorting topics by topicOrder for progressive unlocking
 *
 * @service TopicsService
 *
 * @example
 * ```typescript
 * // Get topics for a category and user
 * const topics = await topicsService.findAll(userId, 'grammar');
 * console.log(topics.length); // Number of topics
 * ```
 */
@Injectable()
export class TopicsService {
  private readonly logger = new Logger(TopicsService.name);
  
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    this.logger.log(`Fetching topics for user: ${userId}`);
    
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { levelId: true }
    });

    this.logger.log(`User level: ${user?.levelId}`);

    const topics = await this.prisma.topic.findMany({
      where: { 
        levelId: user.levelId
      } as Prisma.TopicWhereInput,
      select: {
        topicId: true,
        categoryId: true,
        levelId: true,
        topicOrder: true
      },
      orderBy: {
        topicOrder: 'asc'
      }
    });

    this.logger.log(`Found ${topics.length} topics for level ${user?.levelId}`);
    this.logger.log('Topics:', topics);

    return topics;
  }
} 
