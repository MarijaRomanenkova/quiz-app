import { Controller, Get, UseGuards, Req, Query, Logger } from '@nestjs/common';
import { ReadingTextsService } from './reading-texts.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user: { id: string };
}

@Controller('reading-texts')
@UseGuards(JwtAuthGuard)
export class ReadingTextsController {
  private readonly logger = new Logger(ReadingTextsController.name);
  
  constructor(private readonly readingTextsService: ReadingTextsService) {}

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
