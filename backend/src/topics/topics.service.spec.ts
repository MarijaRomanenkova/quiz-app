import { Test, TestingModule } from '@nestjs/testing';
import { TopicsService } from './topics.service';
import { PrismaService } from '../prisma/prisma.service';

describe('TopicsService', () => {
  let service: TopicsService;
  let prisma: any;

  const mockTopics = [
    { topicId: 't1', categoryId: 'c1', levelId: 'A1.1', topicOrder: 1 },
    { topicId: 't2', categoryId: 'c1', levelId: 'A1.1', topicOrder: 2 },
  ];

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
    },
    topic: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TopicsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<TopicsService>(TopicsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return topics for the user level', async () => {
      prisma.user.findUnique.mockResolvedValue({ levelId: 'A1.1' });
      prisma.topic.findMany.mockResolvedValue(mockTopics);
      const result = await service.findAll('user-123');
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-123' },
        select: { levelId: true },
      });
      expect(prisma.topic.findMany).toHaveBeenCalledWith({
        where: { levelId: 'A1.1' },
        select: {
          topicId: true,
          categoryId: true,
          levelId: true,
          topicOrder: true,
        },
        orderBy: { topicOrder: 'asc' },
      });
      expect(result).toEqual(mockTopics);
    });
  });
}); 
