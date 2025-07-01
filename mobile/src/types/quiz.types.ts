/**
 * @fileoverview Quiz-related type definitions for the mobile application
 * 
 * This module contains TypeScript type definitions for quiz-related data
 * structures, including quiz state, results, and statistics. These types
 * ensure type safety when working with quiz data throughout the application.
 * 
 * The module includes:
 * - Quiz state and active quiz types
 * - Quiz results and statistics types
 * - Daily stats tracking types
 * 
 * @module types/quiz
 */

/**
 * Daily statistics for quiz tracking
 * 
 * @interface DailyStats
 * @property {string} date - Date in YYYY-MM-DD format
 * @property {number} timeSpent - Time spent on quizzes in minutes
 * @property {number} questionsAnswered - Number of questions answered
 */
export interface DailyStats {
  date: string;
  timeSpent: number;
  questionsAnswered: number;
}

/**
 * Quiz result data structure
 * 
 * @interface QuizResult
 * @property {number} score - User's score on the quiz (0-100)
 * @property {number} totalQuestions - Total number of questions in the quiz
 * @property {number} timeSpent - Time spent on the quiz in minutes
 */
export interface QuizResult {
  score: number;
  totalQuestions: number;
  timeSpent: number;
}

/**
 * Active quiz state during a quiz session
 * 
 * @interface ActiveQuiz
 * @property {number} currentQuestion - Index of the current question (0-based)
 * @property {number} score - Current score in the quiz
 * @property {number | null} selectedAnswer - Index of the selected answer, null if none selected
 * @property {string | null} currentTextId - Current reading text ID or null if none
 * @property {boolean} showReadingText - Whether reading text is currently shown
 */
export interface ActiveQuiz {
  currentQuestion: number;
  score: number;
  selectedAnswer: number | null;
  currentTextId: string | null;
  showReadingText: boolean;
}

/**
 * Quiz state interface for Redux store
 * 
 * @interface QuizState
 * @property {string | null} currentTopicId - ID of the currently selected topic
 * @property {Question[]} wrongQuestions - Questions answered incorrectly in current session
 * @property {DailyStats[]} dailyStats - Array of daily statistics
 * @property {QuizResult | null} currentResult - Current quiz result or null if no result is stored
 * @property {ActiveQuiz | null} activeQuiz - Current active quiz state or null if no quiz is active
 */
export interface QuizState {
  currentTopicId: string | null;
  wrongQuestions: Question[];
  dailyStats: DailyStats[];
  currentResult: QuizResult | null;
  activeQuiz: ActiveQuiz | null;
}

// Import Question type from main types
import type { Question } from './index'; 
