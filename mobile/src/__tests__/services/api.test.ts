import {
  fetchCategories,
  fetchQuestions,
  fetchTopics,
  fetchReadingTexts,
  fetchUserProfile,
  updateUserProfile,
  syncStatisticsData,
  fetchStatisticsData,
} from '../../services/api';
import { API_URL } from '../../config/index';

// Mock the config module
jest.mock('../../config/index', () => ({
  API_URL: 'http://localhost:3000',
}));

// Mock fetch globally
global.fetch = jest.fn();

const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

describe('API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    console.error = jest.fn(); // Mock console.error to avoid noise in tests
  });

  describe('fetchCategories', () => {
    const mockCategories = [
      {
        categoryId: 'cat-1',
        title: 'Grammar Basics',
        description: 'Learn fundamental grammar rules',
        progress: 75,
      },
      {
        categoryId: 'cat-2',
        title: 'Vocabulary',
        description: 'Expand your vocabulary',
        progress: 45,
      },
    ];

    it('should fetch categories without authentication', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockCategories),
      };

      mockFetch.mockResolvedValue(mockResponse as any);

      const result = await fetchCategories();

      expect(mockFetch).toHaveBeenCalledWith(`${API_URL}/categories`, {
        headers: {},
      });

      expect(result).toEqual(mockCategories);
    });

    it('should fetch categories with authentication token', async () => {
      const token = 'test-token-123';
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockCategories),
      };

      mockFetch.mockResolvedValue(mockResponse as any);

      const result = await fetchCategories(token);

      expect(mockFetch).toHaveBeenCalledWith(`${API_URL}/categories`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      expect(result).toEqual(mockCategories);
    });

    it('should throw error when request fails', async () => {
      const mockResponse = {
        ok: false,
        json: jest.fn().mockResolvedValue({ message: 'Server error' }),
      };

      mockFetch.mockResolvedValue(mockResponse as any);

      await expect(fetchCategories()).rejects.toThrow('Server error');
    });

    it('should throw default error when response has no message', async () => {
      const mockResponse = {
        ok: false,
        json: jest.fn().mockResolvedValue({}),
      };

      mockFetch.mockResolvedValue(mockResponse as any);

      await expect(fetchCategories()).rejects.toThrow('Request failed');
    });

    it('should throw error when network request fails', async () => {
      const networkError = new Error('Network error');
      mockFetch.mockRejectedValue(networkError);

      await expect(fetchCategories()).rejects.toThrow('Network error');
      expect(console.error).toHaveBeenCalledWith('Error fetching categories:', networkError);
    });
  });

  describe('fetchQuestions', () => {
    const topicId = 'topic-123';
    const mockQuizResponse = {
      questions: [
        {
          id: 'q1',
          text: 'What is the correct form?',
          options: ['A', 'B', 'C', 'D'],
          correctAnswer: 0,
        },
      ],
      nextCursor: 'cursor-123',
      hasMore: true,
    };

    it('should fetch questions without cursor and token', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockQuizResponse),
      };

      mockFetch.mockResolvedValue(mockResponse as any);

      const result = await fetchQuestions(topicId);

      expect(mockFetch).toHaveBeenCalledWith(`${API_URL}/questions?topicId=${topicId}`, {
        headers: {},
      });

      expect(result).toEqual(mockQuizResponse);
    });

    it('should fetch questions with cursor and token', async () => {
      const cursor = 'cursor-123';
      const token = 'test-token-123';
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockQuizResponse),
      };

      mockFetch.mockResolvedValue(mockResponse as any);

      const result = await fetchQuestions(topicId, cursor, token);

      expect(mockFetch).toHaveBeenCalledWith(`${API_URL}/questions?topicId=${topicId}&cursor=${cursor}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      expect(result).toEqual(mockQuizResponse);
    });

    it('should throw error when request fails', async () => {
      const mockResponse = {
        ok: false,
        json: jest.fn().mockResolvedValue({ message: 'Topic not found' }),
      };

      mockFetch.mockResolvedValue(mockResponse as any);

      await expect(fetchQuestions(topicId)).rejects.toThrow('Topic not found');
    });

    it('should throw error when network request fails', async () => {
      const networkError = new Error('Network error');
      mockFetch.mockRejectedValue(networkError);

      await expect(fetchQuestions(topicId)).rejects.toThrow('Network error');
      expect(console.error).toHaveBeenCalledWith('Error fetching questions:', networkError);
    });
  });

  describe('fetchTopics', () => {
    const mockTopics = [
      {
        id: 'topic-1',
        title: 'Basic Grammar',
        description: 'Learn basic grammar rules',
        categoryId: 'cat-1',
        order: 1,
      },
      {
        id: 'topic-2',
        title: 'Advanced Grammar',
        description: 'Learn advanced grammar concepts',
        categoryId: 'cat-1',
        order: 2,
      },
    ];

    it('should fetch topics without authentication', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockTopics),
      };

      mockFetch.mockResolvedValue(mockResponse as any);

      const result = await fetchTopics();

      expect(mockFetch).toHaveBeenCalledWith(`${API_URL}/topics`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      expect(result).toEqual(mockTopics);
    });

    it('should fetch topics with authentication token', async () => {
      const token = 'test-token-123';
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockTopics),
      };

      mockFetch.mockResolvedValue(mockResponse as any);

      const result = await fetchTopics(token);

      expect(mockFetch).toHaveBeenCalledWith(`${API_URL}/topics`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      expect(result).toEqual(mockTopics);
    });

    it('should throw error when request fails', async () => {
      const mockResponse = {
        ok: false,
        status: 500,
      };

      mockFetch.mockResolvedValue(mockResponse as any);

      await expect(fetchTopics()).rejects.toThrow('HTTP error! status: 500');
    });

    it('should throw error when network request fails', async () => {
      const networkError = new Error('Network error');
      mockFetch.mockRejectedValue(networkError);

      await expect(fetchTopics()).rejects.toThrow('Network error');
      expect(console.error).toHaveBeenCalledWith('Error fetching topics:', networkError);
    });
  });

  describe('fetchReadingTexts', () => {
    const mockTexts = [
      {
        id: 'text-1',
        title: 'Reading Passage 1',
        content: 'This is the content of the reading passage...',
        topicId: 'topic-1',
      },
    ];

    it('should fetch all reading texts without filters', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockTexts),
      };

      mockFetch.mockResolvedValue(mockResponse as any);

      const result = await fetchReadingTexts();

      expect(mockFetch).toHaveBeenCalledWith(`${API_URL}/reading-texts`, {
        headers: {},
      });

      expect(result).toEqual(mockTexts);
    });

    it('should fetch reading texts filtered by topic', async () => {
      const topicId = 'topic-1';
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockTexts),
      };

      mockFetch.mockResolvedValue(mockResponse as any);

      const result = await fetchReadingTexts(topicId);

      expect(mockFetch).toHaveBeenCalledWith(`${API_URL}/reading-texts?topicId=${topicId}`, {
        headers: {},
      });

      expect(result).toEqual(mockTexts);
    });

    it('should fetch reading texts with authentication token', async () => {
      const token = 'test-token-123';
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockTexts),
      };

      mockFetch.mockResolvedValue(mockResponse as any);

      const result = await fetchReadingTexts(undefined, token);

      expect(mockFetch).toHaveBeenCalledWith(`${API_URL}/reading-texts`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      expect(result).toEqual(mockTexts);
    });

    it('should throw error when request fails', async () => {
      const mockResponse = {
        ok: false,
        json: jest.fn().mockResolvedValue({ message: 'No texts found' }),
      };

      mockFetch.mockResolvedValue(mockResponse as any);

      await expect(fetchReadingTexts()).rejects.toThrow('No texts found');
    });
  });

  describe('fetchUserProfile', () => {
    const token = 'test-token-123';
    const mockProfile = {
      id: 'user-123',
      email: 'user@example.com',
      username: 'testuser',
      studyPaceId: 2,
      marketingEmails: false,
      shareDevices: false,
    };

    it('should fetch user profile successfully', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockProfile),
      };

      mockFetch.mockResolvedValue(mockResponse as any);

      const result = await fetchUserProfile(token);

      expect(mockFetch).toHaveBeenCalledWith(`${API_URL}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      expect(result).toEqual(mockProfile);
    });

    it('should throw error when request fails', async () => {
      const mockResponse = {
        ok: false,
        json: jest.fn().mockResolvedValue({ message: 'Unauthorized' }),
      };

      mockFetch.mockResolvedValue(mockResponse as any);

      await expect(fetchUserProfile(token)).rejects.toThrow('Unauthorized');
    });
  });

  describe('updateUserProfile', () => {
    const token = 'test-token-123';
    const profileData = {
      studyPaceId: 3,
      marketingEmails: true,
      shareDevices: true,
    };

    it('should update user profile successfully', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ message: 'Profile updated' }),
      };

      mockFetch.mockResolvedValue(mockResponse as any);

      const result = await updateUserProfile(profileData, token);

      expect(mockFetch).toHaveBeenCalledWith(`${API_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });

      expect(result).toEqual({ message: 'Profile updated' });
    });

    it('should throw error when request fails', async () => {
      const mockResponse = {
        ok: false,
        status: 400,
      };

      mockFetch.mockResolvedValue(mockResponse as any);

      await expect(updateUserProfile(profileData, token)).rejects.toThrow('HTTP error! status: 400');
    });
  });

  describe('syncStatisticsData', () => {
    const token = 'test-token-123';
    const statisticsData = {
      totalQuizMinutes: 120,
      dailyQuizTimes: [
        { date: '2024-01-01', minutes: 30, lastUpdated: '2024-01-01T10:00:00Z' },
      ],
      completedTopics: [
        { topicId: 'topic-1', score: 85, completedAt: '2024-01-01T10:00:00Z' },
      ],
    };

    it('should sync statistics data successfully', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ message: 'Statistics synced' }),
      };

      mockFetch.mockResolvedValue(mockResponse as any);

      const result = await syncStatisticsData(statisticsData, token);

      expect(mockFetch).toHaveBeenCalledWith(`${API_URL}/auth/quiz-time`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(statisticsData),
      });

      expect(result).toEqual({ message: 'Statistics synced' });
    });

    it('should throw error when request fails', async () => {
      const mockResponse = {
        ok: false,
        status: 500,
      };

      mockFetch.mockResolvedValue(mockResponse as any);

      await expect(syncStatisticsData(statisticsData, token)).rejects.toThrow('HTTP error! status: 500');
    });
  });

  describe('fetchStatisticsData', () => {
    const token = 'test-token-123';
    const mockStatistics = {
      dailyQuizTimes: [
        { date: '2024-01-01', minutes: 30, lastUpdated: '2024-01-01T10:00:00Z' },
      ],
      totalQuizMinutes: 120,
      completedTopics: [
        { topicId: 'topic-1', score: 85, completedAt: '2024-01-01T10:00:00Z' },
      ],
    };

    it('should fetch statistics data successfully', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockStatistics),
      };

      mockFetch.mockResolvedValue(mockResponse as any);

      const result = await fetchStatisticsData(token);

      expect(mockFetch).toHaveBeenCalledWith(`${API_URL}/auth/quiz-time`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      expect(result).toEqual(mockStatistics);
    });

    it('should return default values when request fails', async () => {
      const mockResponse = {
        ok: false,
        status: 404,
      };

      mockFetch.mockResolvedValue(mockResponse as any);

      const result = await fetchStatisticsData(token);

      expect(result).toEqual({
        dailyQuizTimes: [],
        totalQuizMinutes: 0,
        completedTopics: [],
      });
    });

    it('should return default values when network request fails', async () => {
      const networkError = new Error('Network error');
      mockFetch.mockRejectedValue(networkError);

      const result = await fetchStatisticsData(token);

      expect(result).toEqual({
        dailyQuizTimes: [],
        totalQuizMinutes: 0,
        completedTopics: [],
      });
      expect(console.error).toHaveBeenCalledWith('Error fetching statistics data:', networkError);
    });
  });
}); 
