import { Test, TestingModule } from '@nestjs/testing';
import { QuestionsService } from './questions.service';
import { PrismaService } from '../prisma/prisma.service';

describe('QuestionsService', () => {
  let service: QuestionsService;
  let prisma: any;

  const mockQuestions = [
    {
      questionId: 'q1',
      questionText: 'Which article is correct?',
      options: ['der', 'die', 'das'],
      correctAnswerId: '0',
      imageUrl: null,
      audioUrl: null,
      readingTextId: null,
      topicId: 'articles'
    },
    {
      questionId: 'q2',
      questionText: 'What is the correct form?',
      options: ['am', 'is', 'are'],
      correctAnswerId: '1',
      imageUrl: null,
      audioUrl: null,
      readingTextId: null,
      topicId: 'articles'
    }
  ];

  const mockPrismaService = {
    question: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuestionsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<QuestionsService>(QuestionsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return questions for a specific topic', async () => {
      prisma.question.findMany.mockResolvedValue(mockQuestions);
      const result = await service.findAll('user-123', 'articles');
      
      expect(prisma.question.findMany).toHaveBeenCalledWith({
        where: { topicId: 'articles' },
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
      
      expect(result).toEqual({
        questions: mockQuestions,
        hasMore: false
      });
    });

    it('should return empty questions array when no questions found', async () => {
      prisma.question.findMany.mockResolvedValue([]);
      const result = await service.findAll('user-123', 'empty-topic');
      
      expect(result).toEqual({
        questions: [],
        hasMore: false
      });
    });
  });
}); 
