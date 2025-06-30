import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

// Mock Resend
jest.mock('resend', () => {
  return {
    Resend: jest.fn().mockImplementation(() => ({
      emails: {
        send: jest.fn().mockResolvedValue({ id: 'mock-email-id' }),
      },
    })),
  };
});

// Set required environment variables for tests
beforeAll(() => {
  process.env.BACKEND_URL = 'http://localhost:3000';
  process.env.SENDER_EMAIL = 'noreply@example.com';
});

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: any;
  let jwtService: JwtService;

  const mockPrismaService = {
    findUser: jest.fn(),
    createUser: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
    getUserProfile: jest.fn(),
    loadStatisticsData: jest.fn(),
    syncStatisticsData: jest.fn(),
    // Nested mocks for .user and .statistics
    user: {
      delete: jest.fn(),
      findUnique: jest.fn(),
    },
    statistics: {
      findUnique: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
    },
  };

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    const registerDto = {
      email: 'test@example.com',
      password: 'Password123!',
      username: 'testuser',
      studyPaceId: 2,
      agreedToTerms: true,
    };

    it('should register a new user successfully', async () => {
      const hashedPassword = 'hashedPassword123';
      const mockUser = {
        id: 'user-123',
        email: registerDto.email,
        username: registerDto.username,
        emailVerified: false,
        levelId: 'A1.1',
        studyPaceId: registerDto.studyPaceId,
        agreedToTerms: registerDto.agreedToTerms,
        marketingEmails: false,
        shareDevices: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.findUser.mockResolvedValue(null);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword as never);
      mockPrismaService.createUser.mockResolvedValue(mockUser);

      const result = await service.register(registerDto);

      expect(mockPrismaService.findUser).toHaveBeenCalledWith({ email: registerDto.email });
      expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.password, 10);
      expect(mockPrismaService.createUser).toHaveBeenCalledWith({
        email: registerDto.email,
        username: registerDto.username,
        password: hashedPassword,
        studyPaceId: registerDto.studyPaceId,
        agreedToTerms: registerDto.agreedToTerms,
        marketingEmails: false,
        shareDevices: false,
        verificationToken: expect.any(String),
        verificationTokenExpires: expect.any(Date),
        level: {
          connect: {
            levelId: 'A1.1'
          }
        }
      });
      expect(result).toEqual({
        message: 'Registration successful. Please check your email to verify your account.',
      });
    });

    it('should throw an error if user already exists', async () => {
      const existingUser = { id: 'user-123', email: registerDto.email };
      mockPrismaService.findUser.mockResolvedValue(existingUser);

      await expect(service.register(registerDto)).rejects.toThrow('User with this email already exists');
    });
  });

  describe('login', () => {
    const loginDto = {
      email: 'test@example.com',
      password: 'Password123!',
    };

    it('should login user successfully with valid credentials', async () => {
      const mockUser = {
        id: 'user-123',
        email: loginDto.email,
        username: 'testuser',
        password: 'hashedPassword123',
        emailVerified: true,
        levelId: 'A1.1',
        studyPaceId: 2,
        agreedToTerms: true,
        marketingEmails: false,
        shareDevices: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.findUser.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
      mockJwtService.sign.mockReturnValue('mock-jwt-token');

      const result = await service.login(loginDto);

      expect(mockPrismaService.findUser).toHaveBeenCalledWith({ email: loginDto.email });
      expect(bcrypt.compare).toHaveBeenCalledWith(loginDto.password, mockUser.password);
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
      });
      expect(result).toEqual({
        access_token: 'mock-jwt-token',
        user: {
          id: mockUser.id,
          email: mockUser.email,
          username: mockUser.username,
          levelId: mockUser.levelId,
          studyPaceId: mockUser.studyPaceId,
          agreedToTerms: mockUser.agreedToTerms,
          marketingEmails: mockUser.marketingEmails,
          shareDevices: mockUser.shareDevices,
        },
      });
    });

    it('should throw an error if user does not exist', async () => {
      mockPrismaService.findUser.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow('Invalid credentials');
    });

    it('should throw an error if password is incorrect', async () => {
      const mockUser = {
        id: 'user-123',
        email: loginDto.email,
        password: 'hashedPassword123',
      };

      mockPrismaService.findUser.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      await expect(service.login(loginDto)).rejects.toThrow('Invalid credentials');
    });

    it('should throw an error if email is not verified', async () => {
      const mockUser = {
        id: 'user-123',
        email: loginDto.email,
        password: 'hashedPassword123',
        emailVerified: false,
      };

      mockPrismaService.findUser.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      await expect(service.login(loginDto)).rejects.toThrow('Please verify your email first');
    });
  });

  describe('verifyEmail', () => {
    it('should verify email successfully with valid token', async () => {
      const token = 'valid-token';
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        verificationToken: token,
        verificationTokenExpires: new Date(Date.now() + 3600000), // 1 hour from now
      };
      mockPrismaService.findUser.mockResolvedValue(mockUser);
      mockPrismaService.updateUser.mockResolvedValue({ ...mockUser, emailVerified: true });
      const result = await service.verifyEmail(token);
      expect(mockPrismaService.findUser).toHaveBeenCalledWith({ verificationToken: token });
      // Check that updateUser was called with two parameters: where and data
      expect(mockPrismaService.updateUser).toHaveBeenCalledWith(
        { id: mockUser.id },
        {
          emailVerified: true,
          verificationToken: null,
          verificationTokenExpires: null,
        }
      );
      expect(result).toEqual({
        message: 'Email verified successfully',
      });
    });

    it('should throw an error if token is invalid', async () => {
      const token = 'invalid-token';
      mockPrismaService.findUser.mockResolvedValue(null);

      await expect(service.verifyEmail(token)).rejects.toThrow('Invalid verification token');
    });

    it('should throw an error if token is expired', async () => {
      const token = 'expired-token';
      const mockUser = {
        id: 'user-123',
        verificationToken: token,
        verificationTokenExpires: new Date(Date.now() - 3600000), // 1 hour ago
      };

      mockPrismaService.findUser.mockResolvedValue(mockUser);

      await expect(service.verifyEmail(token)).rejects.toThrow('Verification token has expired');
    });
  });

  describe('getUserProfile', () => {
    it('should return user profile successfully', async () => {
      const userId = 'user-123';
      const mockUser = {
        id: userId,
        email: 'test@example.com',
        username: 'testuser',
        levelId: 'A1.1',
        studyPaceId: 2,
        agreedToTerms: true,
        marketingEmails: false,
        shareDevices: false,
        emailVerified: true,
      };
      mockPrismaService.findUser.mockResolvedValue(mockUser);
      const result = await service.getUserProfile(userId);
      expect(mockPrismaService.findUser).toHaveBeenCalledWith({ id: userId });
      expect(result).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        username: mockUser.username,
        levelId: mockUser.levelId,
        studyPaceId: mockUser.studyPaceId,
        agreedToTerms: mockUser.agreedToTerms,
        marketingEmails: mockUser.marketingEmails,
        shareDevices: mockUser.shareDevices,
        emailVerified: mockUser.emailVerified,
      });
    });
  });

  describe('updateUserProfile', () => {
    it('should update user profile successfully', async () => {
      const userId = 'user-123';
      const updateData = {
        studyPaceId: 3,
        marketingEmails: true,
        shareDevices: true,
      };
      const mockUpdatedUser = {
        id: userId,
        email: 'test@example.com',
        username: 'testuser',
        levelId: 'A1.1',
        studyPaceId: updateData.studyPaceId,
        agreedToTerms: true,
        marketingEmails: updateData.marketingEmails,
        shareDevices: updateData.shareDevices,
        emailVerified: true,
      };
      mockPrismaService.findUser.mockResolvedValue({ id: userId });
      mockPrismaService.updateUser.mockResolvedValue(mockUpdatedUser);
      const result = await service.updateUserProfile(userId, updateData);
      // Check that updateUser was called with two parameters: where and data
      expect(mockPrismaService.updateUser).toHaveBeenCalledWith(
        { id: userId },
        {
          studyPaceId: updateData.studyPaceId,
          marketingEmails: updateData.marketingEmails,
          shareDevices: updateData.shareDevices,
        }
      );
      expect(result).toEqual({
        id: mockUpdatedUser.id,
        email: mockUpdatedUser.email,
        username: mockUpdatedUser.username,
        levelId: mockUpdatedUser.levelId,
        studyPaceId: mockUpdatedUser.studyPaceId,
        agreedToTerms: mockUpdatedUser.agreedToTerms,
        marketingEmails: mockUpdatedUser.marketingEmails,
        shareDevices: mockUpdatedUser.shareDevices,
        emailVerified: mockUpdatedUser.emailVerified,
      });
    });
  });

  describe('deleteUserAccount', () => {
    it('should delete user account successfully', async () => {
      const userId = 'user-123';
      mockPrismaService.user.delete.mockResolvedValue({ id: userId });
      const result = await service.deleteUserAccount(userId);
      expect(mockPrismaService.user.delete).toHaveBeenCalledWith({ where: { id: userId } });
      expect(result).toEqual({ message: 'Account deleted successfully' });
    });
  });

  describe('loadStatisticsData', () => {
    it('should load statistics data successfully', async () => {
      const userId = 'user-123';
      const mockStatistics = {
        totalQuizMinutes: 120,
        dailyQuizTimes: [],
        completedTopics: [],
      };
      mockPrismaService.statistics.findUnique.mockResolvedValue(mockStatistics);
      const result = await service.loadStatisticsData(userId);
      expect(mockPrismaService.statistics.findUnique).toHaveBeenCalledWith({ where: { userId } });
      expect(result).toEqual(mockStatistics);
    });
  });

  describe('syncStatisticsData', () => {
    it('should sync statistics data successfully', async () => {
      const userId = 'user-123';
      const statisticsData = {
        totalQuizMinutes: 150,
        dailyQuizTimes: [{ date: '2024-01-01', minutes: 30 }],
        completedTopics: [{ topicId: 'topic-1', categoryId: 'cat-1' }],
      };
      mockPrismaService.statistics.findUnique.mockResolvedValue({ userId });
      mockPrismaService.statistics.update.mockResolvedValue(undefined);
      await service.syncStatisticsData(userId, statisticsData);
      expect(mockPrismaService.statistics.findUnique).toHaveBeenCalledWith({ where: { userId } });
      expect(mockPrismaService.statistics.update).toHaveBeenCalledWith({
        where: { userId },
        data: statisticsData,
      });
    });
  });
});
