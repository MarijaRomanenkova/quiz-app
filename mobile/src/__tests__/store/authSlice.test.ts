import { configureStore } from '@reduxjs/toolkit';
import authReducer, {
  setCredentials,
  setLoading,
  setError,
  logout,
  updateUserPreferences,
  loginWithStatistics,
  logoutWithStatisticsSync,
} from '../../store/authSlice';
import { loadStatisticsData } from '../../store/statisticsSlice';
import { loadCompletedTopics, updateCompletedTopicsCategories } from '../../store/progressSlice';
import authService from '../../services/authService';
import { fetchStatisticsData, syncStatisticsData, updateUserProfile } from '../../services/api';

// Mock the services
jest.mock('../../services/authService');
jest.mock('../../services/api');

const mockAuthService = authService as jest.Mocked<typeof authService>;
const mockApi = {
  fetchStatisticsData: fetchStatisticsData as jest.MockedFunction<typeof fetchStatisticsData>,
  syncStatisticsData: syncStatisticsData as jest.MockedFunction<typeof syncStatisticsData>,
  updateUserProfile: updateUserProfile as jest.MockedFunction<typeof updateUserProfile>,
};

describe('authSlice', () => {
  let store: ReturnType<typeof setupStore>;

  const setupStore = () => {
    return configureStore({
      reducer: {
        auth: authReducer,
        statistics: (state: any = { totalQuizMinutes: 0, dailyQuizTimes: [] }, action: any) => {
          if (action.type === loadStatisticsData.type) {
            const payload = action.payload || {};
            return { 
              totalQuizMinutes: payload.totalQuizMinutes || state.totalQuizMinutes,
              dailyQuizTimes: payload.dailyQuizTimes || state.dailyQuizTimes
            };
          }
          return state;
        },
        progress: (state: any = { topicProgress: {} }, action: any) => {
          if (action.type === loadCompletedTopics.type) {
            const completedTopics = action.payload || [];
            const newTopicProgress = { ...state.topicProgress };
            
            // Convert completed topics to topic progress format
            completedTopics.forEach((completedTopic: any) => {
              newTopicProgress[completedTopic.topicId] = {
                topicId: completedTopic.topicId,
                categoryId: '', // Will be set when topics are loaded
                completed: true,
                score: completedTopic.score,
                attempts: 1, // We don't store attempts in backend, so default to 1
                lastAttemptDate: completedTopic.completedAt
              };
            });
            
            return { topicProgress: newTopicProgress };
          }
          return state;
        },
      },
    });
  };

  beforeEach(() => {
    store = setupStore();
    jest.clearAllMocks();
  });

  describe('reducers', () => {
    describe('setCredentials', () => {
      it('should set token and user data', () => {
        const credentials = {
          token: 'test-token',
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

        store.dispatch(setCredentials(credentials));

        const state = store.getState().auth;
        expect(state.token).toBe('test-token');
        expect(state.user).toEqual(credentials.user);
        expect(state.error).toBeNull();
      });
    });

    describe('setLoading', () => {
      it('should set loading state', () => {
        store.dispatch(setLoading(true));
        expect(store.getState().auth.isLoading).toBe(true);

        store.dispatch(setLoading(false));
        expect(store.getState().auth.isLoading).toBe(false);
      });
    });

    describe('setError', () => {
      it('should set error message', () => {
        store.dispatch(setError('Login failed'));
        expect(store.getState().auth.error).toBe('Login failed');

        store.dispatch(setError(null));
        expect(store.getState().auth.error).toBeNull();
      });
    });

    describe('logout', () => {
      it('should clear all authentication data', () => {
        // First set some data
        store.dispatch(setCredentials({
          token: 'test-token',
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
        }));

        // Then logout
        store.dispatch(logout());

        const state = store.getState().auth;
        expect(state.token).toBeNull();
        expect(state.user).toBeNull();
        expect(state.error).toBeNull();
      });
    });

    describe('updateUserPreferences', () => {
      it('should update user preferences', () => {
        // First set user data
        store.dispatch(setCredentials({
          token: 'test-token',
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
        }));

        // Update preferences
        store.dispatch(updateUserPreferences({
          studyPaceId: 3,
          marketingEmails: true,
          shareDevices: true,
        }));

        const state = store.getState().auth;
        expect(state.user?.studyPaceId).toBe(3);
        expect(state.user?.marketingEmails).toBe(true);
        expect(state.user?.shareDevices).toBe(true);
      });

      it('should not update preferences if no user', () => {
        store.dispatch(updateUserPreferences({
          studyPaceId: 3,
        }));

        const state = store.getState().auth;
        expect(state.user).toBeNull();
      });
    });
  });

  describe('async thunks', () => {
    describe('loginWithStatistics', () => {
      it('should handle successful login with statistics loading', async () => {
        const credentials = { email: 'test@example.com', password: 'password123' };
        const loginResponse = {
          access_token: 'test-token',
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
        const statisticsData = {
          totalQuizMinutes: 120,
          dailyQuizTimes: [],
          completedTopics: [
            { topicId: 'topic-1', score: 85, completedAt: '2024-01-01' },
          ],
        };

        mockAuthService.login.mockResolvedValue(loginResponse);
        mockApi.fetchStatisticsData.mockResolvedValue(statisticsData);

        await store.dispatch(loginWithStatistics(credentials));

        const state = store.getState().auth;
        expect(state.isLoading).toBe(false);
        expect(state.token).toBe('test-token');
        expect(state.user).toEqual(loginResponse.user);
        expect(state.error).toBeNull();

        expect(mockAuthService.login).toHaveBeenCalledWith(credentials);
        expect(mockApi.fetchStatisticsData).toHaveBeenCalledWith('test-token');
      });

      it('should handle login failure', async () => {
        const credentials = { email: 'test@example.com', password: 'wrongpassword' };
        const error = new Error('Invalid credentials');

        mockAuthService.login.mockRejectedValue(error);

        await store.dispatch(loginWithStatistics(credentials));

        const state = store.getState().auth;
        expect(state.isLoading).toBe(false);
        expect(state.error).toBe('Invalid credentials');
        expect(state.token).toBeNull();
        expect(state.user).toBeNull();
      });

      it('should handle statistics loading failure gracefully', async () => {
        const credentials = { email: 'test@example.com', password: 'password123' };
        const loginResponse = {
          access_token: 'test-token',
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

        mockAuthService.login.mockResolvedValue(loginResponse);
        mockApi.fetchStatisticsData.mockRejectedValue(new Error('Network error'));

        await store.dispatch(loginWithStatistics(credentials));

        const state = store.getState().auth;
        expect(state.isLoading).toBe(false);
        expect(state.token).toBe('test-token');
        expect(state.user).toEqual(loginResponse.user);
        expect(state.error).toBeNull(); // Should not fail login if statistics fail
      });
    });

    describe('logoutWithStatisticsSync', () => {
      it('should handle successful logout with statistics sync', async () => {
        // Set up initial state
        store.dispatch(setCredentials({
          token: 'test-token',
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
        }));

        // Set up statistics and progress state
        store.dispatch(loadStatisticsData({
          totalQuizMinutes: 120,
          dailyQuizTimes: [{ date: '2024-01-01', minutes: 30, lastUpdated: '2024-01-01T00:00:00Z' }],
        }));
        
        // Set up completed topics in progress state
        store.dispatch(loadCompletedTopics([
          {
            topicId: 'topic-1',
            score: 85,
            completedAt: '2024-01-01T10:00:00Z',
          },
        ]));
        
        // Manually set the categoryId for the completed topic since loadCompletedTopics sets it to empty string
        const progressState = store.getState().progress;
        if (progressState.topicProgress['topic-1']) {
          store.dispatch(updateCompletedTopicsCategories([{ topicId: 'topic-1', categoryId: 'test-category' }]));
        }

        mockApi.syncStatisticsData.mockResolvedValue({ success: true });
        mockApi.updateUserProfile.mockResolvedValue({
          id: 'user-123',
          email: 'test@example.com',
          username: 'testuser',
          emailVerified: true,
          levelId: 'A1.1',
          studyPaceId: 2,
          agreedToTerms: true,
          marketingEmails: false,
          shareDevices: false,
        });

        await store.dispatch(logoutWithStatisticsSync());

        const state = store.getState().auth;
        expect(state.isLoading).toBe(false);
        expect(state.token).toBeNull();
        expect(state.user).toBeNull();
        expect(state.error).toBeNull();

        expect(mockApi.syncStatisticsData).toHaveBeenCalledWith({
          totalQuizMinutes: 120,
          dailyQuizTimes: [{ date: '2024-01-01', minutes: 30, lastUpdated: '2024-01-01T00:00:00Z' }],
          completedTopics: [
            {
              topicId: 'topic-1',
              score: 85,
              completedAt: '2024-01-01T10:00:00Z',
            },
          ],
        }, 'test-token');

        expect(mockApi.updateUserProfile).toHaveBeenCalledWith({
          studyPaceId: 2,
          marketingEmails: false,
          shareDevices: false,
        }, 'test-token');
      });

      it('should handle logout without statistics sync when no data', async () => {
        // Set up initial state without statistics
        store.dispatch(setCredentials({
          token: 'test-token',
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
        }));

        await store.dispatch(logoutWithStatisticsSync());

        const state = store.getState().auth;
        expect(state.isLoading).toBe(false);
        expect(state.token).toBeNull();
        expect(state.user).toBeNull();

        // Should not call sync APIs when no data
        expect(mockApi.syncStatisticsData).not.toHaveBeenCalled();
        expect(mockApi.updateUserProfile).toHaveBeenCalled();
      });

      it('should handle sync failures gracefully', async () => {
        // Set up initial state
        store.dispatch(setCredentials({
          token: 'test-token',
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
        }));

        mockApi.syncStatisticsData.mockRejectedValue(new Error('Network error'));
        mockApi.updateUserProfile.mockRejectedValue(new Error('Network error'));

        await store.dispatch(logoutWithStatisticsSync());

        const state = store.getState().auth;
        expect(state.isLoading).toBe(false);
        expect(state.token).toBeNull();
        expect(state.user).toBeNull();
        expect(state.error).toBeNull(); // Should not fail logout if sync fails
      });
    });
  });
}); 
