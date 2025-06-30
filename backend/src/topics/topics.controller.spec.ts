import { Test, TestingModule } from '@nestjs/testing';
import { TopicsController } from './topics.controller';
import { TopicsService } from './topics.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

describe('TopicsController', () => {
  let controller: TopicsController;
  let service: any;

  const mockTopics = [
    { topicId: 't1', categoryId: 'c1', levelId: 'A1.1', topicOrder: 1 },
    { topicId: 't2', categoryId: 'c1', levelId: 'A1.1', topicOrder: 2 },
  ];

  const mockTopicsService = {
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TopicsController],
      providers: [
        { provide: TopicsService, useValue: mockTopicsService },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<TopicsController>(TopicsController);
    service = module.get<TopicsService>(TopicsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /topics', () => {
    it('should return all topics for authenticated user', async () => {
      service.findAll.mockResolvedValue(mockTopics);
      const req = { user: { id: 'user-123' }, headers: {} } as any;
      const result = await controller.findAll(req);
      expect(service.findAll).toHaveBeenCalledWith('user-123');
      expect(result).toEqual(mockTopics);
    });
  });
}); 
