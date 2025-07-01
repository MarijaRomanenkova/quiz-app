import { renderHook, act } from '@testing-library/react-native';
import { useAuth } from '../../hooks/useAuth';
import authService from '../../services/authService';
import { fetchUserProfile, fetchStatisticsData, syncStatisticsData } from '../../services/api';
import { setCredentials, setLoading, setError, logout } from '../../store/authSlice';
import { updateUserProfile } from '../../store/userSlice';
import { loadStatisticsData } from '../../store/statisticsSlice';
import { loadCompletedTopics } from '../../store/progressSlice';

// Mock the services
jest.mock('../../services/authService');
jest.mock('../../services/api');

// Mock Redux
const mockDispatch = jest.fn();
const mockUseSelector = jest.fn();

jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: (selector: any) => mockUseSelector(selector),
}));

const mockAuthService = authService as jest.Mocked<typeof authService>;
const mockApi = {
  fetchUserProfile: fetchUserProfile as jest.MockedFunction<typeof fetchUserProfile>,
  fetchStatisticsData: fetchStatisticsData as jest.MockedFunction<typeof fetchStatisticsData>,
  syncStatisticsData: syncStatisticsData as jest.MockedFunction<typeof syncStatisticsData>,
};

describe('useAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    console.warn = jest.fn(); // Mock console.warn to avoid noise in tests
    
    // Default mock state
    mockUseSelector.mockImplementation((selector) => {
      if (selector.toString().includes('state.auth')) {
        return {
          token: null,
          user: null,
          isLoading: false,
          error: null,
        };
      }
      if (selector.toString().includes('state.statistics')) {
        return {
          dailyQuizTimes: [],
          totalQuizMinutes: 0,
        };
      }
      if (selector.toString().includes('state.progress')) {
        return {
          topicProgress: {},
        };
      }
      return {};
    });
  });

  describe('initial state', () => {
    it('should return initial authentication state', () => {
      const { result } = renderHook(() => useAuth());

      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(typeof result.current.login).toBe('function');
      expect(typeof result.current.register).toBe('function');
      expect(typeof result.current.logout).toBe('function');
    });

    it('should return authenticated state when user is logged in', () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        username: 'testuser',
        emailVerified: true,
        levelId: 'A1.1',
        studyPaceId: 2,
        agreedToTerms: true,
        marketingEmails: false,
        shareDevices: false,
      };

      mockUseSelector.mockImplementation((selector) => {
        if (selector.toString().includes('state.auth')) {
          return {
            token: 'test-token-123',
            user: mockUser,
            isLoading: false,
            error: null,
          };
        }
        return {};
      });

      const { result } = renderHook(() => useAuth());

      expect(result.current.user).toEqual(mockUser);
      expect(result.current.token).toBe('test-token-123');
      expect(result.current.isAuthenticated).toBe(true);
    });
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

    it('should successfully login user', async () => {
      mockAuthService.login.mockResolvedValue(mockAuthResponse);
      mockApi.fetchUserProfile.mockResolvedValue(mockAuthResponse.user);
      mockApi.fetchStatisticsData.mockResolvedValue({
        dailyQuizTimes: [],
        totalQuizMinutes: 0,
        completedTopics: [],
      });

      const { result } = renderHook(() => useAuth());

      let loginResult: boolean = false;
      await act(async () => {
        loginResult = await result.current.login(credentials.email, credentials.password);
      });

      expect(loginResult).toBe(true);
      expect(mockDispatch).toHaveBeenCalledWith(setLoading(true));
      expect(mockAuthService.login).toHaveBeenCalledWith(credentials);
      expect(mockDispatch).toHaveBeenCalledWith(setCredentials({
        token: mockAuthResponse.access_token,
        user: {
          id: mockAuthResponse.user.id,
          email: mockAuthResponse.user.email,
          username: mockAuthResponse.user.username,
          emailVerified: mockAuthResponse.user.emailVerified,
          levelId: mockAuthResponse.user.levelId,
          studyPaceId: 1, // Default value
          agreedToTerms: true, // Default value
          marketingEmails: false, // Default value
          shareDevices: false, // Default value
        },
      }));
      expect(mockDispatch).toHaveBeenCalledWith(setLoading(false));
    });

    it('should handle login failure', async () => {
      const loginError = new Error('Invalid credentials');
      mockAuthService.login.mockRejectedValue(loginError);

      const { result } = renderHook(() => useAuth());

      let loginResult: boolean = false;
      await act(async () => {
        loginResult = await result.current.login(credentials.email, credentials.password);
      });

      expect(loginResult).toBe(false);
      expect(mockDispatch).toHaveBeenCalledWith(setLoading(true));
      expect(mockDispatch).toHaveBeenCalledWith(setError('Invalid credentials'));
      expect(mockDispatch).toHaveBeenCalledWith(setLoading(false));
    });

    it('should handle profile fetch failure gracefully', async () => {
      mockAuthService.login.mockResolvedValue(mockAuthResponse);
      mockApi.fetchUserProfile.mockRejectedValue(new Error('Profile fetch failed'));
      mockApi.fetchStatisticsData.mockResolvedValue({
        dailyQuizTimes: [],
        totalQuizMinutes: 0,
        completedTopics: [],
      });

      const { result } = renderHook(() => useAuth());

      let loginResult: boolean = false;
      await act(async () => {
        loginResult = await result.current.login(credentials.email, credentials.password);
      });

      expect(loginResult).toBe(true);
      expect(console.warn).toHaveBeenCalledWith('Failed to fetch user profile:', expect.any(Error));
    });

    it('should handle statistics fetch failure gracefully', async () => {
      mockAuthService.login.mockResolvedValue(mockAuthResponse);
      mockApi.fetchUserProfile.mockResolvedValue(mockAuthResponse.user);
      mockApi.fetchStatisticsData.mockRejectedValue(new Error('Statistics fetch failed'));

      const { result } = renderHook(() => useAuth());

      let loginResult: boolean = false;
      await act(async () => {
        loginResult = await result.current.login(credentials.email, credentials.password);
      });

      expect(loginResult).toBe(true);
      expect(console.warn).toHaveBeenCalledWith('Failed to fetch statistics data:', expect.any(Error));
    });

    it('should load completed topics when available', async () => {
      const completedTopics = [
        { topicId: 'topic-1', score: 85, completedAt: '2024-01-01' },
      ];

      mockAuthService.login.mockResolvedValue(mockAuthResponse);
      mockApi.fetchUserProfile.mockResolvedValue(mockAuthResponse.user);
      mockApi.fetchStatisticsData.mockResolvedValue({
        dailyQuizTimes: [],
        totalQuizMinutes: 0,
        completedTopics,
      });

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.login(credentials.email, credentials.password);
      });

      expect(mockDispatch).toHaveBeenCalledWith(loadCompletedTopics(completedTopics));
    });
  });

  describe('register', () => {
    const registerData = {
      email: 'newuser@example.com',
      password: 'password123',
      username: 'newuser',
      studyPaceId: 2,
      agreedToTerms: true,
    };

    it('should successfully register user', async () => {
      mockAuthService.register.mockResolvedValue({ message: 'User registered successfully' });

      const { result } = renderHook(() => useAuth());

      let registerResult: boolean = false;
      await act(async () => {
        registerResult = await result.current.register(
          registerData.email,
          registerData.password,
          registerData.username,
          registerData.studyPaceId,
          registerData.agreedToTerms
        );
      });

      expect(registerResult).toBe(true);
      expect(mockDispatch).toHaveBeenCalledWith(setLoading(true));
      expect(mockAuthService.register).toHaveBeenCalledWith(registerData);
      expect(mockDispatch).toHaveBeenCalledWith(setLoading(false));
    });

    it('should handle registration failure', async () => {
      const registerError = new Error('Email already exists');
      mockAuthService.register.mockRejectedValue(registerError);

      const { result } = renderHook(() => useAuth());

      let registerResult: boolean = false;
      await act(async () => {
        registerResult = await result.current.register(
          registerData.email,
          registerData.password,
          registerData.username
        );
      });

      expect(registerResult).toBe(false);
      expect(mockDispatch).toHaveBeenCalledWith(setLoading(true));
      expect(mockDispatch).toHaveBeenCalledWith(setError('Email already exists'));
      expect(mockDispatch).toHaveBeenCalledWith(setLoading(false));
    });

    it('should use default values for optional parameters', async () => {
      mockAuthService.register.mockResolvedValue({ message: 'User registered successfully' });

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.register(registerData.email, registerData.password, registerData.username);
      });

      expect(mockAuthService.register).toHaveBeenCalledWith({
        email: registerData.email,
        password: registerData.password,
        username: registerData.username,
        studyPaceId: 1, // Default value
        agreedToTerms: false, // Default value
      });
    });
  });

  describe('logout', () => {
    it('should logout user and clear state', async () => {
      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.logout();
      });

      expect(mockDispatch).toHaveBeenCalledWith(logout());
    });

    it('should sync statistics data before logout when available', async () => {
      // Mock authenticated state with statistics data
      mockUseSelector.mockImplementation((selector) => {
        if (selector.toString().includes('state.auth')) {
          return {
            token: 'test-token-123',
            user: { id: 'user-123' },
            isLoading: false,
            error: null,
          };
        }
        if (selector.toString().includes('state.statistics')) {
          return {
            dailyQuizTimes: [{ date: '2024-01-01', minutes: 30 }],
            totalQuizMinutes: 30,
          };
        }
        if (selector.toString().includes('state.progress')) {
          return {
            topicProgress: {
              'topic-1': {
                topicId: 'topic-1',
                completed: true,
                score: 85,
                lastAttemptDate: '2024-01-01T10:00:00Z',
              },
            },
          };
        }
        return {};
      });

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.logout();
      });

      expect(mockApi.syncStatisticsData).toHaveBeenCalledWith({
        dailyQuizTimes: [{ date: '2024-01-01', minutes: 30 }],
        totalQuizMinutes: 30,
        completedTopics: [
          {
            topicId: 'topic-1',
            score: 85,
            completedAt: '2024-01-01T10:00:00Z',
          },
        ],
      }, 'test-token-123');
      expect(mockDispatch).toHaveBeenCalledWith(logout());
    });

    it('should handle sync failure gracefully', async () => {
      // Mock authenticated state with statistics data
      mockUseSelector.mockImplementation((selector) => {
        if (selector.toString().includes('state.auth')) {
          return {
            token: 'test-token-123',
            user: { id: 'user-123' },
            isLoading: false,
            error: null,
          };
        }
        if (selector.toString().includes('state.statistics')) {
          return {
            dailyQuizTimes: [{ date: '2024-01-01', minutes: 30 }],
            totalQuizMinutes: 30,
          };
        }
        return {};
      });

      mockApi.syncStatisticsData.mockRejectedValue(new Error('Sync failed'));

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.logout();
      });

      expect(console.warn).toHaveBeenCalledWith('Error during logout sync:', expect.any(Error));
      expect(mockDispatch).toHaveBeenCalledWith(logout());
    });

    it('should not sync when no statistics data available', async () => {
      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.logout();
      });

      expect(mockApi.syncStatisticsData).not.toHaveBeenCalled();
      expect(mockDispatch).toHaveBeenCalledWith(logout());
    });
  });
}); 
