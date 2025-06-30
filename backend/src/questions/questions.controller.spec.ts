import { Test, TestingModule } from '@nestjs/testing';
import { QuestionsController } from './questions.controller';
import { QuestionsService } from './questions.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

describe('QuestionsController', () => {
  let controller: QuestionsController;
  let service: any;

  const mockQuestionsResponse = {
    questions: [
      {
        questionId: 'q1',
        questionText: 'Which article is correct?',
        options: ['der', 'die', 'das'],
        correctAnswerId: '0',
        imageUrl: null,
        audioUrl: null,
        readingTextId: null,
        topicId: 'articles',
      },
    ],
    hasMore: false,
  };

  const mockQuestionsService = {
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuestionsController],
      providers: [
        { provide: QuestionsService, useValue: mockQuestionsService },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<QuestionsController>(QuestionsController);
    service = module.get<QuestionsService>(QuestionsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /questions', () => {
    it('should return questions for a topic for authenticated user', async () => {
      service.findAll.mockResolvedValue(mockQuestionsResponse);
      const req = { user: { id: 'user-123' } } as any;
      const result = await controller.findAll(req, 'articles');
      expect(service.findAll).toHaveBeenCalledWith('user-123', 'articles');
      expect(result).toEqual(mockQuestionsResponse);
    });
  });
}); 
