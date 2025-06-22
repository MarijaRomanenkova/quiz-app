import { Controller, Get, UseGuards, Req, Query, Logger } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user: { id: string };
}

/**
 * Questions controller that handles quiz question retrieval
 * 
 * This controller provides endpoints for fetching questions by topic with pagination support.
 * All endpoints require JWT authentication and return questions filtered by the user's level.
 * 
 * @controller questions
 * @example
 * ```typescript
 * // Get questions for a specific topic
 * GET /questions?topicId=articles&cursor=some_cursor
 * Authorization: Bearer <jwt_token>
 * 
 * // Response
 * {
 *   "questions": [...],
 *   "nextCursor": "next_page_cursor",
 *   "hasMore": true
 * }
 * ```
 */
@Controller('questions')
@UseGuards(JwtAuthGuard)
export class QuestionsController {
  private readonly logger = new Logger(QuestionsController.name);
  
  constructor(private readonly questionsService: QuestionsService) {}

  /**
   * Get questions for a specific topic
   * 
   * Retrieves questions for the specified topic, filtered by the authenticated user's level.
   * 
   * @param req - Express request object with authenticated user
   * @param topicId - ID of the topic to get questions for
   * @returns Promise containing questions array and pagination metadata
   * 
   * @example
   * ```typescript
   * // Get questions for a topic
   * const result = await questionsController.findAll(req, 'articles');
   * ```
   */
  @Get()
  async findAll(
    @Req() req: RequestWithUser,
    @Query('topicId') topicId: string,
  ) {
    this.logger.log(`Questions request received for user: ${req.user?.id}, topicId: ${topicId}`);
    
    try {
      const questions = await this.questionsService.findAll(req.user.id, topicId);
      this.logger.log(`Questions response: ${JSON.stringify(questions)}`);
      return questions;
    } catch (error) {
      this.logger.error(`Error fetching questions: ${error.message}`);
      throw error;
    }
  }
} 
