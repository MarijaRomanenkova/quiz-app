import { Test, TestingModule } from '@nestjs/testing';
import { ReadingTextsService } from './reading-texts.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ReadingTextsService', () => {
  let service: ReadingTextsService;
  let prisma: any;

  const mockReadingTexts = [
    {
      id: 'rt1',
      title: 'Reading Text 1',
      textContent: 'This is the content of reading text 1',
      questions: [{ topicId: 'articles' }]
    },
    {
      id: 'rt2',
      title: 'Reading Text 2',
      textContent: 'This is the content of reading text 2',
      questions: [{ topicId: 'articles' }]
    }
  ];

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
    },
    readingText: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReadingTextsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<ReadingTextsService>(ReadingTextsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return reading texts for a specific topic', async () => {
      prisma.user.findUnique.mockResolvedValue({ levelId: 'A1.1' });
      prisma.readingText.findMany.mockResolvedValue(mockReadingTexts);
      
      const result = await service.findAll('user-123', 'articles');
      
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-123' },
        select: { levelId: true }
      });
      
      expect(prisma.readingText.findMany).toHaveBeenCalledWith({
        where: {
          questions: {
            some: {
              topicId: 'articles'
            }
          }
        },
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
      
      expect(result).toEqual(mockReadingTexts);
    });

    it('should return all reading texts when no topicId is provided', async () => {
      prisma.user.findUnique.mockResolvedValue({ levelId: 'A1.1' });
      prisma.readingText.findMany.mockResolvedValue(mockReadingTexts);
      
      const result = await service.findAll('user-123');
      
      expect(prisma.readingText.findMany).toHaveBeenCalledWith({
        where: {},
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
      
      expect(result).toEqual(mockReadingTexts);
    });

    it('should return empty array when no reading texts found', async () => {
      prisma.user.findUnique.mockResolvedValue({ levelId: 'A1.1' });
      prisma.readingText.findMany.mockResolvedValue([]);
      
      const result = await service.findAll('user-123', 'empty-topic');
      
      expect(result).toEqual([]);
    });
  });
}); 
