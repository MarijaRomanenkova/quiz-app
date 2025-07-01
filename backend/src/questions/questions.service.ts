import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

/**
 * Questions service that handles quiz question retrieval and management
 * 
 * This service provides business logic for:
 * - Fetching questions by topic and user level
 * - Filtering questions based on user's learning level
 * - Question data transformation and formatting
 * 
 * @service QuestionsService
 * 
 * @example
 * ```typescript
 * // Get questions for a specific topic
 * const questions = await questionsService.findAll(userId, 'articles');
 * 
 * // Questions are filtered by user's level automatically
 * // Number of questions
 * // Pagination info
 * ```
 */
@Injectable()
export class QuestionsService {
  private readonly logger = new Logger(QuestionsService.name);
  
  constructor(private prisma: PrismaService) {}

  /**
   * Get all questions for a specific topic
   * 
   * Retrieves questions for the specified topic. The topic is already filtered
   * by user level at the topics level, so we only need to fetch questions by topicId.
   * The userId is used for authentication purposes only.
   * 
   * @param userId - Unique identifier of the authenticated user (for auth purposes)
   * @param topicId - ID of the topic to get questions for (e.g., 'articles', 'present-tense')
   * @returns Promise containing questions array and pagination metadata
   * 
   * @example
   * ```typescript
   * const result = await questionsService.findAll('user-123', 'articles');
   * 
   * // Result structure:
   * // {
   * //   questions: [
   * //     {
   * //       questionId: 'uuid',
   * //       questionText: 'Which article is correct?',
   * //       options: ['der', 'die', 'das'],
   * //       correctAnswerId: '0',
   * //       imageUrl: null,
   * //       audioUrl: null,
   * //       readingTextId: null,
   * //       topicId: 'articles'
   * //     }
   * //   ],
   * //   hasMore: false
   * // }
   * ```
   */
  async findAll(userId: string, topicId: string) {
    this.logger.log(`Fetching questions for user: ${userId}, topicId: ${topicId}`);
    
    // Questions are fetched by topicId only - level filtering is done at topics level
    // userId is used for authentication purposes only
    const questions = await this.prisma.question.findMany({
      where: { 
        topicId: topicId
      } as Prisma.QuestionWhereInput,
      select: {
        questionId: true,
        questionText: true,
        options: true,
        correctAnswerId: true,
        imageUrl: true,
        audioUrl: true,
        readingTextId: true,
        topicId: true
      }
    });

    this.logger.log(`Found ${questions.length} questions for topic ${topicId}`);

    return {
      questions,
      hasMore: false
    };
  }
} 
