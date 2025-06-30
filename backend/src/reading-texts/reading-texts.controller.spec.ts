import { Test, TestingModule } from '@nestjs/testing';
import { ReadingTextsController } from './reading-texts.controller';
import { ReadingTextsService } from './reading-texts.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

describe('ReadingTextsController', () => {
  let controller: ReadingTextsController;
  let service: any;

  const mockReadingTexts = [
    {
      id: 'rt1',
      title: 'Reading Text 1',
      textContent: 'This is the content of reading text 1',
      questions: [{ topicId: 'articles' }],
    },
    {
      id: 'rt2',
      title: 'Reading Text 2',
      textContent: 'This is the content of reading text 2',
      questions: [{ topicId: 'articles' }],
    },
  ];

  const mockReadingTextsService = {
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReadingTextsController],
      providers: [
        { provide: ReadingTextsService, useValue: mockReadingTextsService },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<ReadingTextsController>(ReadingTextsController);
    service = module.get<ReadingTextsService>(ReadingTextsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /reading-texts', () => {
    it('should return reading texts for a topic for authenticated user', async () => {
      service.findAll.mockResolvedValue(mockReadingTexts);
      const req = { user: { id: 'user-123' } } as any;
      const result = await controller.findAll(req, 'articles');
      expect(service.findAll).toHaveBeenCalledWith('user-123', 'articles');
      expect(result).toEqual(mockReadingTexts);
    });

    it('should return all reading texts when no topicId is provided', async () => {
      service.findAll.mockResolvedValue(mockReadingTexts);
      const req = { user: { id: 'user-123' } } as any;
      const result = await controller.findAll(req);
      expect(service.findAll).toHaveBeenCalledWith('user-123', undefined);
      expect(result).toEqual(mockReadingTexts);
    });
  });
}); 
