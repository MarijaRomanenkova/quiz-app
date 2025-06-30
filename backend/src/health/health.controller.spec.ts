import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { PrismaService } from '../prisma/prisma.service';

describe('HealthController', () => {
  let controller: HealthController;
  let prisma: any;

  const mockPrismaService = {
    checkConnection: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('checkHealth', () => {
    it('should return health status with connected database', async () => {
      prisma.checkConnection.mockResolvedValue(true);
      
      const result = await controller.checkHealth();
      
      expect(prisma.checkConnection).toHaveBeenCalled();
      expect(result).toMatchObject({
        status: 'ok',
        database: 'connected',
        timestamp: expect.any(String)
      });
    });

    it('should return health status with disconnected database', async () => {
      prisma.checkConnection.mockResolvedValue(false);
      
      const result = await controller.checkHealth();
      
      expect(prisma.checkConnection).toHaveBeenCalled();
      expect(result).toMatchObject({
        status: 'ok',
        database: 'disconnected',
        timestamp: expect.any(String)
      });
    });

    it('should return valid ISO timestamp', async () => {
      prisma.checkConnection.mockResolvedValue(true);
      
      const result = await controller.checkHealth();
      
      expect(new Date(result.timestamp).toISOString()).toBe(result.timestamp);
    });
  });
}); 
