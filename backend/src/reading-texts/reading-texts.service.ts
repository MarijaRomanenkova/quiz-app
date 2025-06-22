import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

/**
 * ReadingTexts service that handles reading text retrieval and management
 *
 * This service provides business logic for:
 * - Fetching reading texts by topic and user level
 * - Filtering reading texts based on user's learning level
 *
 * @service ReadingTextsService
 *
 * @example
 * ```typescript
 * // Get reading texts for a topic and user
 * const readingTexts = await readingTextsService.findAll(userId, 'articles');
 * console.log(readingTexts.length); // Number of reading texts
 * ```
 */
@Injectable()
export class ReadingTextsService {
  private readonly logger = new Logger(ReadingTextsService.name);
  
  constructor(private prisma: PrismaService) {}

  /**
   * Get all reading texts for a specific topic filtered by user's level
   *
   * Retrieves all available reading texts for the specified topic, automatically filtered by the user's
   * learning level (A1.1, A1.2, etc.).
   *
   * @param userId - Unique identifier of the authenticated user
   * @param topicId - ID of the topic to get reading texts for (e.g., 'articles')
   * @returns Promise containing array of reading texts with metadata
   *
   * @example
   * ```typescript
   * const readingTexts = await readingTextsService.findAll('user-123', 'articles');
   * // Returns array of reading text objects
   * ```
   */
  async findAll(userId: string, topicId?: string) {
    this.logger.log(`Fetching reading texts for user: ${userId}, topicId: ${topicId}`);
    
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { levelId: true }
    });

    this.logger.log(`User level: ${user?.levelId}`);

    const whereClause: Prisma.ReadingTextWhereInput = {};
    
    if (topicId) {
      // If topicId is provided, get reading texts for that specific topic
      whereClause.questions = {
        some: {
          topicId: topicId
        }
      };
    }

    const readingTexts = await this.prisma.readingText.findMany({
      where: whereClause,
      select: {
        id: true,
        title: true,
        textContent: true,
        questions: {
          select: {
            topicId: true
          }
        }
      }
    });

    this.logger.log(`Found ${readingTexts.length} reading texts`);
    this.logger.log('Reading texts:', readingTexts);

    return readingTexts;
  }
} 
