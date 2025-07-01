/**
 * @fileoverview Statistics-related type definitions for the mobile application
 * 
 * This module contains TypeScript type definitions for statistics-related data
 * structures, including quiz statistics, daily tracking, and completed topics.
 * These types ensure type safety when working with statistics data throughout
 * the application.
 * 
 * The module includes:
 * - Statistics data types
 * - Completed topics tracking types
 * - Daily quiz time tracking types
 * 
 * @module types/statistics
 */

/**
 * Statistics data structure for user learning metrics
 * 
 * @interface StatisticsData
 * @property {number} totalQuizMinutes - Total minutes spent on quizzes
 * @property {DailyQuizTime[]} dailyQuizTimes - Daily quiz time records
 * @property {CompletedTopic[]} completedTopics - Completed topics data
 */
export interface StatisticsData {
  totalQuizMinutes: number;
  dailyQuizTimes: DailyQuizTime[];
  completedTopics: CompletedTopic[];
}

/**
 * Daily quiz time tracking entry
 * 
 * @interface DailyQuizTime
 * @property {string} date - ISO date string in YYYY-MM-DD format
 * @property {number} minutes - Number of minutes spent on quizzes that day
 * @property {string} lastUpdated - ISO timestamp when this record was last updated
 */
export interface DailyQuizTime {
  date: string; // ISO date string (YYYY-MM-DD)
  minutes: number;
  lastUpdated: string; // ISO timestamp
}

/**
 * Completed topic data structure
 * 
 * @interface CompletedTopic
 * @property {string} topicId - Unique identifier for the completed topic
 * @property {number} score - User's score on the topic (0-100)
 * @property {string} completedAt - ISO timestamp when the topic was completed
 */
export interface CompletedTopic {
  topicId: string;
  score: number;
  completedAt: string;
} 
