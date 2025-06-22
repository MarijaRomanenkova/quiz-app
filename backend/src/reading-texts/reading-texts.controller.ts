import { Controller, Get, UseGuards, Req, Query, Logger } from '@nestjs/common';
import { ReadingTextsService } from './reading-texts.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user: { id: string };
}

/**
 * ReadingTexts controller that handles reading text retrieval for learning modules
 *
 * This controller provides endpoints for fetching reading texts by topic and user level.
 * All endpoints require JWT authentication and return reading texts filtered by the user's level.
 *
 * @controller reading-texts
 * @example
 * ```typescript
 * // Get reading texts for a specific topic
 * GET /reading-texts?topicId=articles
 * Authorization: Bearer <jwt_token>
 *
 * // Response
 * {
 *   "readingTexts": [
 *     {
 *       "readingTextId": "uuid",
 *       "title": "Sample Text",
 *       "content": "...",
 *       "topicId": "articles"
 *     }
 *   ]
 * }
 * ```
 */
@Controller('reading-texts')
@UseGuards(JwtAuthGuard)
export class ReadingTextsController {
  private readonly logger = new Logger(ReadingTextsController.name);
  
  constructor(private readonly readingTextsService: ReadingTextsService) {}

  /**
   * Get all reading texts for a specific topic and user level
   *
   * Retrieves all available reading texts for the specified topic, filtered by the user's current learning level.
   *
   * @param req - Express request object with authenticated user
   * @param topicId - ID of the topic to get reading texts for
   * @returns Promise containing array of reading texts with metadata
   *
   * @example
   * ```typescript
   * const readingTexts = await readingTextsController.findAll(req, 'articles');
   * // Returns array of reading text objects
   * ```
   */
  @Get()
  async findAll(@Req() req: RequestWithUser, @Query('topicId') topicId?: string) {
    this.logger.log(`Reading texts request received for user: ${req.user?.id}, topicId: ${topicId}`);
    
    try {
      const readingTexts = await this.readingTextsService.findAll(req.user.id, topicId);
      this.logger.log(`Reading texts response: ${JSON.stringify(readingTexts)}`);
      return readingTexts;
    } catch (error) {
      this.logger.error(`Error fetching reading texts: ${error.message}`);
      throw error;
    }
  }
} 
