import { Controller, Get, UseGuards, Req, Query, Logger } from '@nestjs/common';
import { TopicsService } from './topics.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user: { id: string };
}

/**
 * Topics controller that handles topic retrieval for learning modules
 *
 * This controller provides endpoints for fetching topics by category and user level.
 * All endpoints require JWT authentication and return topics filtered by the user's level.
 *
 * @controller topics
 * @example
 * ```typescript
 * // Get topics for a specific category
 * GET /topics?categoryId=grammar
 * Authorization: Bearer <jwt_token>
 *
 * // Response
 * {
 *   "topics": [
 *     {
 *       "topicId": "articles",
 *       "name": "Articles",
 *       "description": "Learn about German articles",
 *       "categoryId": "grammar",
 *       "topicOrder": 1
 *     }
 *   ]
 * }
 * ```
 */
@Controller('topics')
@UseGuards(JwtAuthGuard)
export class TopicsController {
  private readonly logger = new Logger(TopicsController.name);
  
  constructor(private readonly topicsService: TopicsService) {}

  /**
   * Get all topics for the authenticated user's level
   *
   * Retrieves all available topics for the user's current learning level, sorted by topicOrder.
   *
   * @param req - Express request object with authenticated user
   * @returns Promise containing array of topics with metadata
   *
   * @example
   * ```typescript
   * const topics = await topicsController.findAll(req);
   * // Returns array of topic objects
   * ```
   */
  @Get()
  async findAll(
    @Req() req: RequestWithUser,
  ) {
    this.logger.log(`Topics request received for user: ${req.user?.id}`);
    this.logger.log(`Request headers: ${JSON.stringify(req.headers)}`);
    
    try {
      const topics = await this.topicsService.findAll(req.user.id);
      this.logger.log(`Topics response: ${JSON.stringify(topics)}`);
      return topics;
    } catch (error) {
      this.logger.error(`Error fetching topics: ${error.message}`);
      throw error;
    }
  }
}
