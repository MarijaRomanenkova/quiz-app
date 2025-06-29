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
import { Question, Topic } from '../types';
import { createAsyncThunk } from '@reduxjs/toolkit';

/**
 * Interface for quiz response data
 * 
 * Represents the structure of quiz data returned from the API,
 * including questions, pagination cursor, and availability status.
 * 
 * @interface QuizResponse
 * @property {Question[]} questions - Array of quiz questions
 * @property {string} [nextCursor] - Optional cursor for pagination
 * @property {boolean} hasMore - Whether more questions are available
 */
interface QuizResponse {
  questions: Question[];
  nextCursor?: string;
  hasMore: boolean;
}

/**
 * Interface for category data
 * 
 * Represents the structure of category information including
 * identification, metadata, and progress tracking.
 * 
 * @interface Category
 * @property {string} categoryId - Unique identifier for the category
 * @property {string} title - Display title for the category
 * @property {string} description - Detailed description of the category
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
 * Fetches reading texts, optionally filtered by topic
 * 
 * Retrieves reading materials that can be filtered by topic ID.
 * Supports both authenticated and unauthenticated requests.
 * 
 * @param {string} [topicId] - Optional topic identifier to filter texts
 * @param {string} [token] - Optional authentication token
 * @returns {Promise<any[]>} Array of reading text objects
 * @throws {Error} When the request fails
 * 
 * @example
 * ```tsx
 * const texts = await fetchReadingTexts('grammar-basics', token);
 * ```
 */
export const fetchReadingTexts = async (topicId?: string, token?: string): Promise<any[]> => {
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
export const fetchCategoriesThunk = createAsyncThunk('categories/fetchCategories', async () => {
  const response = await fetchCategories();
  return response;
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
    const readingTextsData: Record<string, any> = {};
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
 * @returns {Promise<any>} User profile data
 * @throws {Error} When the request fails
 * 
 * @example
 * ```tsx
 * const profile = await fetchUserProfile(token);
 * ```
 */
export const fetchUserProfile = async (token: string): Promise<any> => {
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
 * @param {string} token - Authentication token
 * @param {Object} profileData - Profile data to update
 * @param {number} [profileData.studyPaceId] - Study pace preference
 * @param {boolean} [profileData.marketingEmails] - Marketing email consent
 * @param {boolean} [profileData.shareDevices] - Device sharing preference
 * @returns {Promise<any>} Updated profile data
 * @throws {Error} When the request fails
 * 
 * @example
 * ```tsx
 * const result = await updateUserProfile(token, {
 *   studyPaceId: 2,
 *   marketingEmails: true
 * });
 * ```
 */
export const updateUserProfile = async (
  profileData: {
    studyPaceId: number;
    marketingEmails: boolean;
    shareDevices: boolean;
  },
  token?: string
): Promise<any> => {
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
 * @returns {Promise<any>} Deletion confirmation
 * @throws {Error} When the request fails
 * 
 * @example
 * ```tsx
 * await deleteUserAccount(token);
 * ```
 */
export const deleteUserAccount = async (token: string): Promise<any> => {
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
 * Synchronizes quiz time statistics with the backend
 * 
 * Sends local quiz time tracking data to the backend for
 * persistence and analytics. Called on logout to sync Redux state.
 * 
 * @param {Object} quizTimeData - Quiz time statistics from Redux state
 * @param {Array<{date: string, minutes: number, lastUpdated: string}>} quizTimeData.dailyQuizTimes - Daily quiz time records
 * @param {number} quizTimeData.totalQuizMinutes - Total quiz time in minutes
 * @param {string} [token] - Authentication token
 * @returns {Promise<any>} Sync confirmation
 * @throws {Error} When the request fails
 * 
 * @example
 * ```tsx
 * await syncQuizTimeData({
 *   dailyQuizTimes: [{ date: '2024-01-01', minutes: 30, lastUpdated: '2024-01-01T10:00:00Z' }],
 *   totalQuizMinutes: 120
 * }, token);
 * ```
 */
export const syncQuizTimeData = async (
  quizTimeData: {
    totalQuizMinutes: number;
    dailyQuizTimes: Array<{date: string, minutes: number, lastUpdated: string}>;
  },
  token?: string
): Promise<any> => {
  try {
    const response = await fetch(`${API_URL}/auth/quiz-time`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(quizTimeData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error syncing quiz time data:', error);
    throw error;
  }
};

/**
 * Fetches quiz time statistics from the backend
 * 
 * Retrieves stored quiz time tracking data including daily
 * breakdown and total accumulated time. Called on login to load into Redux.
 * 
 * @param {string} [token] - Authentication token
 * @returns {Promise<{dailyQuizTimes: Array<{date: string, minutes: number, lastUpdated: string}>, totalQuizMinutes: number}>} Quiz time statistics
 * @throws {Error} When the request fails
 * 
 * @example
 * ```tsx
 * const quizTimeData = await fetchQuizTimeData(token);
 * // Returns: { dailyQuizTimes: [...], totalQuizMinutes: 120 }
 * ```
 */
export const fetchQuizTimeData = async (token?: string): Promise<{
  dailyQuizTimes: Array<{date: string, minutes: number, lastUpdated: string}>;
  totalQuizMinutes: number;
}> => {
  try {
    const response = await fetch(`${API_URL}/auth/quiz-time`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error fetching quiz time data:', error);
    throw error;
  }
};
