import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class QuestionsService {
  private readonly logger = new Logger(QuestionsService.name);
  
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string, topicId: string) {
    this.logger.log(`Fetching questions for user: ${userId}, topicId: ${topicId}`);
    
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { levelId: true }
    });

    this.logger.log(`User level: ${user?.levelId}`);

    const questions = await this.prisma.question.findMany({
      where: { 
        topicId: topicId
      } as Prisma.QuestionWhereInput,
      select: {
        questionId: true,
        questionText: true,
        options: true,
        correctAnswerId: true,
        points: true,
        imageUrl: true,
        audioUrl: true,
        readingTextId: true,
        topicId: true
      }
    });

    this.logger.log(`Found ${questions.length} questions for topic ${topicId}`);
    this.logger.log('Questions:', questions);

    return {
      questions,
      hasMore: false
    };
  }
} 
