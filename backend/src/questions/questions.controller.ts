import { Controller, Get, UseGuards, Req, Query, Logger } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user: { id: string };
}

@Controller('questions')
@UseGuards(JwtAuthGuard)
export class QuestionsController {
  private readonly logger = new Logger(QuestionsController.name);
  
  constructor(private readonly questionsService: QuestionsService) {}

  @Get()
  async findAll(@Req() req: RequestWithUser, @Query('topicId') topicId: string) {
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
