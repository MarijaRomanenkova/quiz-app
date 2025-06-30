import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

describe('CategoriesController', () => {
  let controller: CategoriesController;
  let service: any;

  const mockCategories = [
    { categoryId: 'cat-1', description: 'Category 1', progress: 0 },
    { categoryId: 'cat-2', description: 'Category 2', progress: 0 },
  ];

  const mockCategoriesService = {
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        { provide: CategoriesService, useValue: mockCategoriesService },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<CategoriesController>(CategoriesController);
    service = module.get<CategoriesService>(CategoriesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /categories', () => {
    it('should return all categories for authenticated user', async () => {
      service.findAll.mockResolvedValue(mockCategories);
      const req = { user: { id: 'user-123' } } as any;
      const result = await controller.findAll(req);
      expect(service.findAll).toHaveBeenCalledWith('user-123');
      expect(result).toEqual(mockCategories);
    });
  });
}); 
