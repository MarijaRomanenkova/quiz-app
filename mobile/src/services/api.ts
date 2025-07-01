/**
 * @fileoverview API Service module for the mobile application
 * 
 * This module provides a comprehensive set of functions for communicating
 * with the backend API. It handles all HTTP requests including authentication,
 * data fetching, user management, and statistics synchronization.
 * 
 * The module includes:
 * - Data fetching functions (categories, topics, questions, reading texts)
 * - User profile management (fetch, update, delete)
 * - Quiz time statistics synchronization
 * - Redux thunk integration for state management
 * - Error handling and response processing
 * - Authentication token management
 * 
 * All functions include proper error handling, logging, and type safety.
 * 
 * @module services/api
 */

import { API_URL } from '../config';
import { 
  Question, 
  QuizResponse, 
  Topic, 
  ReadingText 
} from '../types';
import { 
  ProfileUpdateData 
} from '../types/auth.types';
import { 
  StatisticsData 
} from '../types/statistics.types';
import { User } from '../types/user.types';
import { createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../store';

/**
 * Interface for category data with title property
 * 
 * @interface Category
 * @property {string} categoryId - Unique identifier for the category
 * @property {string} title - Display title for the category
 * @property {string} description - Description of the category
 * @property {number} progress - User's progress percentage in this category
 */
interface Category {
  categoryId: string;
  title: string;
  description: string;
  progress: number;
}

/**
 * Handles HTTP response processing and error handling
 * 
 * Centralized function for processing API responses and throwing
 * appropriate errors when requests fail. Parses error messages
 * from the backend response.
 * 
 * @param {Response} response - The fetch response object
 * @returns {Promise<any>} The parsed JSON response data
 * @throws {Error} When the response is not successful
 * 
 * @example
 * ```tsx
 * const data = await handleResponse(response);
 * ```
 */
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Request failed');
  }
  return response.json();
};

/**
 * Fetches all available categories from the backend
 * 
 * Retrieves the list of learning categories with their metadata
 * and user progress information. Supports optional authentication.
 * 
 * @param {string} [token] - Optional authentication token
 * @returns {Promise<Category[]>} Array of category objects
 * @throws {Error} When the request fails
 * 
 * @example
 * ```tsx
 * const categories = await fetchCategories(token);
 * ```
 */
export const fetchCategories = async (token?: string): Promise<Category[]> => {
  try {
    const response = await fetch(`${API_URL}/categories`, {
      headers: token ? {
        'Authorization': `Bearer ${token}`
      } : {}
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

/**
 * Fetches questions for a specific topic with pagination support
 * 
 * Retrieves quiz questions for a given topic, supporting cursor-based
 * pagination for large question sets. Includes authentication support.
 * 
 * @param {string} topicId - The topic identifier to fetch questions for
 * @param {string} [cursor] - Optional pagination cursor
 * @param {string} [token] - Optional authentication token
 * @returns {Promise<QuizResponse>} Quiz response with questions and pagination info
 * @throws {Error} When the request fails
 * 
 * @example
 * ```tsx
 * const quizData = await fetchQuestions('grammar-basics', undefined, token);
 * ```
 */
export const fetchQuestions = async (topicId: string, cursor?: string, token?: string): Promise<QuizResponse> => {
  try {
    const response = await fetch(`${API_URL}/questions?topicId=${topicId}${cursor ? `&cursor=${cursor}` : ''}`, {
      headers: token ? {
        'Authorization': `Bearer ${token}`
      } : {}
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw error;
  }
};

/**
 * Fetches all available topics from the backend
 * 
 * Retrieves the complete list of learning topics with detailed logging
 * for debugging purposes. Supports optional authentication.
 * 
 * @param {string} [token] - Optional authentication token
 * @returns {Promise<Topic[]>} Array of topic objects
 * @throws {Error} When the request fails
 * 
 * @example
 * ```tsx
 * const topics = await fetchTopics(token);
 * ```
 */
export const fetchTopics = async (token?: string): Promise<Topic[]> => {
  try {
    const response = await fetch(`${API_URL}/topics`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching topics:', error);
    throw error;
  }
};

/**
 * Fetches reading texts for a specific topic or all reading texts
 * 
 * Retrieves reading text content for topics that include reading
 * comprehension exercises. Can fetch texts for a specific topic
 * or all available reading texts.
 * 
 * @param {string} [topicId] - Optional topic ID to filter reading texts
 * @param {string} [token] - Optional authentication token
 * @returns {Promise<ReadingText[]>} Array of reading text objects
 * @throws {Error} When the request fails
 * 
 * @example
 * ```tsx
 * const texts = await fetchReadingTexts('grammar-basics', token);
 * ```
 */
export const fetchReadingTexts = async (topicId?: string, token?: string): Promise<ReadingText[]> => {
  try {
    const url = topicId 
      ? `${API_URL}/reading-texts?topicId=${topicId}`
      : `${API_URL}/reading-texts`;
      
    const response = await fetch(url, {
      headers: token ? {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      } : {}
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching reading texts:', error);
    throw error;
  }
};

/**
 * Redux thunk for fetching categories
 * 
 * Creates an async thunk for Redux integration that fetches
 * categories and can be dispatched to update the store.
 * 
 * @returns {Promise<Category[]>} Array of category objects
 * 
 * @example
 * ```tsx
 * dispatch(fetchCategoriesThunk());
 * ```
 */
export const fetchCategoriesThunk = createAsyncThunk('categories/fetchCategories', async (_, { getState }) => {
  const state = getState() as RootState;
  const token = state.auth.token || undefined;
  return fetchCategories(token);
});

/**
 * Fetches initial application data in parallel
 * 
 * Retrieves categories, topics, and questions for all topics
 * in an optimized parallel request. Used for app initialization
 * and data preloading.
 * 
 * @param {string} [token] - Optional authentication token
 * @returns {Promise<{categories: Category[], topics: Topic[], questions: Record<string, Question[]>}>} Complete initial data
 * @throws {Error} When any request fails
 * 
 * @example
 * ```tsx
 * const { categories, topics, questions } = await fetchInitialData(token);
 * ```
 */
export const fetchInitialData = async (token?: string) => {
  try {
    // Fetch topics first
    const topics = await fetchTopics(token);
    
    // Fetch questions for all topics
    const questionsData: Record<string, Question[]> = {};
    for (const topic of topics) {
      try {
        const response = await fetchQuestions(topic.topicId, undefined, token);
        questionsData[topic.topicId] = response.questions;
      } catch (error) {
        console.warn(`Failed to fetch questions for topic ${topic.topicId}:`, error);
        questionsData[topic.topicId] = [];
      }
    }
    
    // Fetch reading texts for topics that have them
    const readingTextsData: Record<string, ReadingText> = {};
    for (const topic of topics) {
      try {
        const response = await fetchReadingTexts(topic.topicId, token);
        response.forEach(text => {
          readingTextsData[text.id] = text;
        });
      } catch (error) {
        console.warn(`Failed to fetch reading texts for topic ${topic.topicId}:`, error);
      }
    }
    
    return {
      topics,
      questionsData,
      readingTextsData,
    };
  } catch (error) {
    console.error('Error fetching initial data:', error);
    throw error;
  }
};

/**
 * Fetches the current user's profile information
 * 
 * Retrieves detailed user profile data including preferences,
 * settings, and account information. Requires authentication.
 * 
 * @param {string} token - Authentication token
 * @returns {Promise<UserProfile>} User profile data
 * @throws {Error} When the request fails
 * 
 * @example
 * ```tsx
 * const profile = await fetchUserProfile(token);
 * ```
 */
export const fetchUserProfile = async (token: string): Promise<User> => {
  try {
    const response = await fetch(`${API_URL}/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

/**
 * Updates the user's profile information
 * 
 * Sends profile updates to the backend including study preferences,
 * privacy settings, and notification preferences. Requires authentication.
 * 
 * @param {ProfileUpdateData} profileData - Profile data to update
 * @param {string} [token] - Optional authentication token
 * @returns {Promise<UserProfile>} Updated profile data
 * @throws {Error} When the request fails
 * 
 * @example
 * ```tsx
 * const result = await updateUserProfile({
 *   studyPaceId: 2,
 *   marketingEmails: true
 * }, token);
 * ```
 */
export const updateUserProfile = async (
  profileData: ProfileUpdateData,
  token?: string
): Promise<User> => {
  try {
    const response = await fetch(`${API_URL}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

/**
 * Deletes the user's account permanently
 * 
 * Permanently removes the user account and all associated data
 * from the system. This action cannot be undone. Requires authentication.
 * 
 * @param {string} token - Authentication token
 * @returns {Promise<{success: boolean}>} Deletion confirmation
 * @throws {Error} When the request fails
 * 
 * @example
 * ```tsx
 * await deleteUserAccount(token);
 * ```
 */
export const deleteUserAccount = async (token: string): Promise<{success: boolean}> => {
  try {
    const response = await fetch(`${API_URL}/auth/account`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Error deleting user account:', error);
    throw error;
  }
};

/**
 * Synchronizes quiz statistics data with the backend
 * 
 * Sends local quiz statistics to the backend for persistence and
 * analysis. Includes daily quiz times and completed topics data.
 * 
 * @param {StatisticsData} statisticsData - Statistics data to sync
 * @param {string} [token] - Optional authentication token
 * @returns {Promise<{success: boolean}>} Sync confirmation
 * @throws {Error} When the request fails
 * 
 * @example
 * ```tsx
 * await syncStatisticsData({
 *   totalQuizMinutes: 120,
 *   dailyQuizTimes: [...],
 *   completedTopics: [...]
 * }, token);
 * ```
 */
export const syncStatisticsData = async (
  statisticsData: StatisticsData,
  token?: string
): Promise<{success: boolean}> => {
  try {
    const response = await fetch(`${API_URL}/auth/quiz-time`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(statisticsData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error syncing statistics data:', error);
    throw error;
  }
};

/**
 * Fetches user statistics data from the backend
 * 
 * Retrieves the user's quiz statistics including daily quiz times,
 * total minutes spent, and completed topics. Requires authentication.
 * 
 * @param {string} [token] - Optional authentication token
 * @returns {Promise<StatisticsData>} User statistics data
 * @throws {Error} When the request fails
 * 
 * @example
 * ```tsx
 * const stats = await fetchStatisticsData(token);
 * ```
 */
export const fetchStatisticsData = async (token?: string): Promise<StatisticsData> => {
  try {
    const response = await fetch(`${API_URL}/auth/quiz-time`, {
      headers: token ? {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      } : {}
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return {
      dailyQuizTimes: data.dailyQuizTimes || [],
      totalQuizMinutes: data.totalQuizMinutes || 0,
      completedTopics: data.completedTopics || []
    };
  } catch (error) {
    console.error('Error fetching statistics data:', error);
    // Return default values if fetch fails
    return {
      dailyQuizTimes: [],
      totalQuizMinutes: 0,
      completedTopics: []
    };
  }
};
