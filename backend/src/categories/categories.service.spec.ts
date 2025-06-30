import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { PrismaService } from '../prisma/prisma.service';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let prisma: any;

  const mockCategories = [
    { categoryId: 'cat-1', description: 'Category 1', progress: 0 },
    { categoryId: 'cat-2', description: 'Category 2', progress: 0 },
  ];

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
    },
    category: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all categories for a user', async () => {
      prisma.user.findUnique.mockResolvedValue({ levelId: 'A1.1' });
      prisma.category.findMany.mockResolvedValue(mockCategories);
      const result = await service.findAll('user-123');
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-123' },
        select: { levelId: true },
      });
      expect(prisma.category.findMany).toHaveBeenCalledWith({
        select: {
          categoryId: true,
          description: true,
          progress: true,
        },
      });
      expect(result).toEqual(mockCategories);
    });
  });
}); 
