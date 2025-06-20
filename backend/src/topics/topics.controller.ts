import { Controller, Get, UseGuards, Req, Logger } from '@nestjs/common';
import { TopicsService } from './topics.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user: { id: string };
}

@Controller('topics')
@UseGuards(JwtAuthGuard)
export class TopicsController {
  private readonly logger = new Logger(TopicsController.name);
  
  constructor(private readonly topicsService: TopicsService) {}

  @Get()
  async findAll(@Req() req: RequestWithUser) {
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
