import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ReadingTextsService {
  private readonly logger = new Logger(ReadingTextsService.name);
  
  constructor(private prisma: PrismaService) {}

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
