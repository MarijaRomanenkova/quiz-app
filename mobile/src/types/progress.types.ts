/**
 * @fileoverview Progress-related type definitions for the mobile application
 * 
 * This module contains TypeScript type definitions for progress-related data
 * structures, including topic progress, category progress, and learning metrics.
 * These types ensure type safety when working with progress data throughout
 * the application.
 * 
 * The module includes:
 * - Topic progress tracking types
 * - Category progress types
 * - Progress state management types
 * 
 * @module types/progress
 */

/**
 * Individual topic progress tracking
 * 
 * @interface TopicProgress
 * @property {string} topicId - Unique identifier for the topic
 * @property {string} categoryId - ID of the category this topic belongs to
 * @property {boolean} completed - Whether the topic has been completed
 * @property {number} score - User's best score on this topic (0-100)
 * @property {number} attempts - Number of attempts on this topic
 * @property {string} lastAttemptDate - ISO timestamp of the last attempt
 */
export interface TopicProgress {
  topicId: string;
  categoryId: string;
  completed: boolean;
  score: number;
  attempts: number;
  lastAttemptDate: string;
}

/**
 * Category progress tracking
 * 
 * @interface CategoryProgress
 * @property {string} categoryId - Unique identifier for the category
 * @property {number} completedTopics - Number of completed topics in this category
 * @property {number} totalTopics - Total number of topics in this category
 * @property {number} unlockedTopics - Number of topics currently unlocked for this category
 */
export interface CategoryProgress {
  categoryId: string;
  completedTopics: number;
  totalTopics: number;
  unlockedTopics: number;
}

/**
 * Progress state interface for Redux store
 * 
 * @interface ProgressState
 * @property {Record<string, TopicProgress>} topicProgress - Progress data for each topic
 * @property {Record<string, CategoryProgress>} categoryProgress - Progress data for each category
 * @property {boolean} isLoading - Loading state for progress operations
 * @property {string | null} error - Error message from progress operations
 */
export interface ProgressState {
  topicProgress: Record<string, TopicProgress>;
  categoryProgress: Record<string, CategoryProgress>;
  isLoading: boolean;
  error: string | null;
}
