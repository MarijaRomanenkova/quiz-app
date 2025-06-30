import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException, NotFoundException } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt.guard';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: any;
  let configService: any;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
    verifyEmail: jest.fn(),
    getUserProfile: jest.fn(),
    updateUserProfile: jest.fn(),
    deleteUserAccount: jest.fn(),
    loadStatisticsData: jest.fn(),
    syncStatisticsData: jest.fn(),
    forgotPassword: jest.fn(),
    resetPassword: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /auth/register', () => {
    const registerDto = {
      email: 'test@example.com',
      password: 'Password123!',
      username: 'testuser',
      studyPaceId: 2,
      agreedToTerms: true,
    };

    it('should register a new user successfully', async () => {
      const expectedResponse = {
        message: 'Registration successful. Please check your email to verify your account.',
      };
      authService.register.mockResolvedValue(expectedResponse);

      const result = await controller.register(registerDto);

      expect(authService.register).toHaveBeenCalledWith(registerDto);
      expect(result).toEqual(expectedResponse);
    });

    it('should handle registration errors', async () => {
      const error = new Error('User already exists');
      authService.register.mockRejectedValue(error);

      await expect(controller.register(registerDto)).rejects.toThrow('User already exists');
    });
  });

  describe('POST /auth/login', () => {
    const loginDto = {
      email: 'test@example.com',
      password: 'Password123!',
    };

    it('should login user successfully and return JWT token', async () => {
      const expectedResponse = {
        access_token: 'jwt-token-123',
        user: {
          id: 'user-123',
          email: 'test@example.com',
          username: 'testuser',
          levelId: 'A1.1',
          studyPaceId: 2,
          agreedToTerms: true,
          marketingEmails: false,
          shareDevices: false,
        },
      };
      authService.login.mockResolvedValue(expectedResponse);

      const result = await controller.login(loginDto);

      expect(authService.login).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual(expectedResponse);
    });

    it('should handle invalid credentials', async () => {
      authService.login.mockRejectedValue(new UnauthorizedException('Invalid credentials'));

      await expect(controller.login(loginDto)).rejects.toThrow('Invalid credentials');
    });
  });

  describe('GET /auth/verify-email', () => {
    it('should verify email and return success page', async () => {
      const token = 'valid-token';
      const mockResponse = {
        send: jest.fn(),
      };
      configService.get.mockReturnValue('http://localhost:3000');

      await controller.verifyEmail(token, mockResponse as any);

      expect(authService.verifyEmail).toHaveBeenCalledWith(token);
      expect(configService.get).toHaveBeenCalledWith('MOBILE_URL');
      expect(mockResponse.send).toHaveBeenCalled();
    });
  });

  describe('GET /auth/profile', () => {
    it('should return user profile for authenticated user', async () => {
      const mockRequest = {
        user: { id: 'user-123' },
      };
      const expectedProfile = {
        id: 'user-123',
        email: 'test@example.com',
        username: 'testuser',
        levelId: 'A1.1',
        studyPaceId: 2,
        agreedToTerms: true,
        marketingEmails: false,
        shareDevices: false,
        emailVerified: true,
      };
      authService.getUserProfile.mockResolvedValue(expectedProfile);

      const result = await controller.getProfile(mockRequest as any);

      expect(authService.getUserProfile).toHaveBeenCalledWith('user-123');
      expect(result).toEqual(expectedProfile);
    });
  });

  describe('PUT /auth/profile', () => {
    it('should update user profile for authenticated user', async () => {
      const mockRequest = {
        user: { id: 'user-123' },
      };
      const updateDto = {
        studyPaceId: 3,
        marketingEmails: true,
        shareDevices: true,
      };
      const expectedResponse = {
        id: 'user-123',
        ...updateDto,
      };
      authService.updateUserProfile.mockResolvedValue(expectedResponse);

      const result = await controller.updateProfile(mockRequest as any, updateDto);

      expect(authService.updateUserProfile).toHaveBeenCalledWith('user-123', updateDto);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('DELETE /auth/account', () => {
    it('should delete user account for authenticated user', async () => {
      const mockRequest = {
        user: { id: 'user-123' },
      };
      const expectedResponse = {
        message: 'Account deleted successfully',
      };
      authService.deleteUserAccount.mockResolvedValue(expectedResponse);

      const result = await controller.deleteAccount(mockRequest as any);

      expect(authService.deleteUserAccount).toHaveBeenCalledWith('user-123');
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('GET /auth/quiz-time', () => {
    it('should load statistics data for authenticated user', async () => {
      const mockRequest = {
        user: { id: 'user-123' },
      };
      const expectedStatistics = {
        totalQuizMinutes: 120,
        dailyQuizTimes: [],
        completedTopics: [],
      };
      authService.loadStatisticsData.mockResolvedValue(expectedStatistics);

      const result = await controller.loadStatisticsData(mockRequest as any);

      expect(authService.loadStatisticsData).toHaveBeenCalledWith('user-123');
      expect(result).toEqual(expectedStatistics);
    });
  });

  describe('POST /auth/quiz-time', () => {
    it('should sync statistics data for authenticated user', async () => {
      const mockRequest = {
        user: { id: 'user-123' },
      };
      const statisticsData = {
        totalQuizMinutes: 150,
        dailyQuizTimes: [{ date: '2024-01-01', minutes: 30 }],
        completedTopics: [{ topicId: 'topic-1', categoryId: 'cat-1' }],
      };
      const expectedResponse = {
        message: 'Statistics data synced successfully',
      };
      authService.syncStatisticsData.mockResolvedValue(expectedResponse);

      const result = await controller.syncStatisticsData(mockRequest as any, statisticsData);

      expect(authService.syncStatisticsData).toHaveBeenCalledWith('user-123', statisticsData);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('POST /auth/forgot-password', () => {
    it('should handle forgot password request', async () => {
      const email = 'test@example.com';
      authService.forgotPassword.mockResolvedValue(undefined);

      const result = await controller.forgotPassword(email);

      expect(authService.forgotPassword).toHaveBeenCalledWith(email);
      expect(result).toEqual({
        message: 'If an account exists with this email, you will receive password reset instructions.',
      });
    });
  });

  describe('POST /auth/reset-password/:token', () => {
    it('should reset password with valid token', async () => {
      const token = 'valid-token';
      const password = 'NewPassword123!';
      const expectedResponse = {
        message: 'Password reset successful',
      };
      authService.resetPassword.mockResolvedValue(expectedResponse);

      const result = await controller.resetPassword(token, password);

      expect(authService.resetPassword).toHaveBeenCalledWith(token, password);
      expect(result).toEqual(expectedResponse);
    });
  });
}); 
