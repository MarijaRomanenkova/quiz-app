import authService from '../../services/authService';
import { API_URL } from '../../config/index';

// Mock the config module
jest.mock('../../config/index', () => ({
  API_URL: 'http://localhost:3000',
}));

// Mock fetch globally
global.fetch = jest.fn();

const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

describe('authService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    console.error = jest.fn(); // Mock console.error to avoid noise in tests
  });

  describe('login', () => {
    const credentials = {
      email: 'test@example.com',
      password: 'password123',
    };

    const mockAuthResponse = {
      access_token: 'test-token-123',
      user: {
        id: 'user-123',
        email: 'test@example.com',
        username: 'testuser',
        emailVerified: true,
        levelId: 'A1.1',
        studyPaceId: 2,
        agreedToTerms: true,
        marketingEmails: false,
        shareDevices: false,
      },
    };

    it('should successfully login with valid credentials', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockAuthResponse),
      };

      mockFetch.mockResolvedValue(mockResponse as any);

      const result = await authService.login(credentials);

      expect(mockFetch).toHaveBeenCalledWith(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      expect(result).toEqual(mockAuthResponse);
      expect(mockResponse.json).toHaveBeenCalled();
    });

    it('should throw error when login fails with server error', async () => {
      const mockResponse = {
        ok: false,
        json: jest.fn().mockResolvedValue({ message: 'Invalid credentials' }),
      };

      mockFetch.mockResolvedValue(mockResponse as any);

      await expect(authService.login(credentials)).rejects.toThrow('Invalid credentials');

      expect(mockFetch).toHaveBeenCalledWith(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
    });

    it('should throw default error when server response has no message', async () => {
      const mockResponse = {
        ok: false,
        json: jest.fn().mockResolvedValue({}),
      };

      mockFetch.mockResolvedValue(mockResponse as any);

      await expect(authService.login(credentials)).rejects.toThrow('Login failed');
    });

    it('should throw error when network request fails', async () => {
      const networkError = new Error('Network error');
      mockFetch.mockRejectedValue(networkError);

      await expect(authService.login(credentials)).rejects.toThrow('Network error');
      expect(console.error).toHaveBeenCalledWith('Login error:', networkError);
    });

    it('should throw error when JSON parsing fails', async () => {
      const mockResponse = {
        ok: false,
        json: jest.fn().mockRejectedValue(new Error('JSON parse error')),
      };

      mockFetch.mockResolvedValue(mockResponse as any);

      await expect(authService.login(credentials)).rejects.toThrow('JSON parse error');
    });
  });

  describe('register', () => {
    const registerData = {
      email: 'newuser@example.com',
      password: 'password123',
      username: 'newuser',
      studyPaceId: 1,
      agreedToTerms: true,
    };

    const mockRegisterResponse = {
      message: 'User registered successfully',
    };

    it('should successfully register a new user', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockRegisterResponse),
      };

      mockFetch.mockResolvedValue(mockResponse as any);

      const result = await authService.register(registerData);

      expect(mockFetch).toHaveBeenCalledWith(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
      });

      expect(result).toEqual(mockRegisterResponse);
      expect(mockResponse.json).toHaveBeenCalled();
    });

    it('should throw error when registration fails with server error', async () => {
      const mockResponse = {
        ok: false,
        json: jest.fn().mockResolvedValue({ message: 'Email already exists' }),
      };

      mockFetch.mockResolvedValue(mockResponse as any);

      await expect(authService.register(registerData)).rejects.toThrow('Email already exists');
    });

    it('should throw default error when server response has no message', async () => {
      const mockResponse = {
        ok: false,
        json: jest.fn().mockResolvedValue({}),
      };

      mockFetch.mockResolvedValue(mockResponse as any);

      await expect(authService.register(registerData)).rejects.toThrow('Registration failed');
    });

    it('should handle JSON parsing error gracefully', async () => {
      const mockResponse = {
        ok: false,
        json: jest.fn().mockRejectedValue(new Error('JSON parse error')),
      };

      mockFetch.mockResolvedValue(mockResponse as any);

      await expect(authService.register(registerData)).rejects.toThrow('Failed to parse error response');
    });

    it('should throw error when network request fails', async () => {
      const networkError = new Error('Network error');
      mockFetch.mockRejectedValue(networkError);

      await expect(authService.register(registerData)).rejects.toThrow('Network error');
      expect(console.error).toHaveBeenCalledWith('Registration error:', networkError);
    });
  });

  describe('verifyEmail', () => {
    const token = 'verification-token-123';
    const mockVerifyResponse = {
      message: 'Email verified successfully',
    };

    it('should successfully verify email with valid token', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockVerifyResponse),
      };

      mockFetch.mockResolvedValue(mockResponse as any);

      const result = await authService.verifyEmail(token);

      expect(mockFetch).toHaveBeenCalledWith(`${API_URL}/auth/verify-email/${token}`, {
        method: 'POST',
      });

      expect(result).toEqual(mockVerifyResponse);
      expect(mockResponse.json).toHaveBeenCalled();
    });

    it('should throw error when email verification fails', async () => {
      const mockResponse = {
        ok: false,
      };

      mockFetch.mockResolvedValue(mockResponse as any);

      await expect(authService.verifyEmail(token)).rejects.toThrow('Email verification failed');
    });

    it('should throw error when network request fails', async () => {
      const networkError = new Error('Network error');
      mockFetch.mockRejectedValue(networkError);

      await expect(authService.verifyEmail(token)).rejects.toThrow('Network error');
    });
  });

  describe('resendVerification', () => {
    const email = 'user@example.com';
    const mockResendResponse = {
      message: 'Verification email sent successfully',
    };

    it('should successfully resend verification email', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockResendResponse),
      };

      mockFetch.mockResolvedValue(mockResponse as any);

      const result = await authService.resendVerification(email);

      expect(mockFetch).toHaveBeenCalledWith(`${API_URL}/auth/resend-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      expect(result).toEqual(mockResendResponse);
      expect(mockResponse.json).toHaveBeenCalled();
    });

    it('should throw error when resend verification fails', async () => {
      const mockResponse = {
        ok: false,
      };

      mockFetch.mockResolvedValue(mockResponse as any);

      await expect(authService.resendVerification(email)).rejects.toThrow('Failed to resend verification email');
    });

    it('should throw error when network request fails', async () => {
      const networkError = new Error('Network error');
      mockFetch.mockRejectedValue(networkError);

      await expect(authService.resendVerification(email)).rejects.toThrow('Network error');
    });
  });
}); 
