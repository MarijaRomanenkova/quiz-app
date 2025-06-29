/**
 * @fileoverview Core type definitions for the mobile application
 * 
 * This module contains the primary type definitions used throughout the application,
 * including quiz questions, user data, categories, topics, and various state interfaces.
 * These types define the data structures for the learning platform and ensure type
 * safety across components and services.
 * 
 * The module includes:
 * - Quiz and question related types
 * - User profile and preferences types
 * - Category and topic management types
 * - Statistics and progress tracking types
 * - Type guards for runtime type checking
 * 
 * @module types
 */

/**
 * Represents a quiz question with all its properties and metadata
 * 
 * This interface defines the structure of a quiz question, including its content,
 * options, correct answer, and optional media attachments. Questions can be of
 * different types (text, image, audio, reading) and belong to specific topics
 * and categories.
 * 
 * @interface Question
 * @property {string} id - Unique database identifier for the question
 * @property {string} questionId - Legacy identifier for backward compatibility
 * @property {string} questionText - The main question text content
 * @property {string} topicId - ID of the topic this question belongs to
 * @property {string} categoryId - ID of the category this question belongs to
 * @property {string} correctAnswerId - ID of the correct answer option
 * @property {string[]} options - Array of possible answer options
 * @property {string} [imageUrl] - Optional URL to an image for image-based questions
 * @property {string} [audioUrl] - Optional URL to an audio file for audio questions
 * @property {string} [readingTextId] - Optional ID linking to reading text content
 * @property {string} createdAt - ISO timestamp when the question was created
 * @property {string} updatedAt - ISO timestamp when the question was last updated
 * 
 * @example
 * ```tsx
 * const question: Question = {
 *   id: "q1",
 *   questionId: "question_001",
 *   questionText: "What is the capital of Germany?",
 *   topicId: "geography",
 *   categoryId: "general",
 *   correctAnswerId: "berlin",
 *   options: ["Berlin", "Munich", "Hamburg", "Frankfurt"],
 *   createdAt: "2024-01-01T00:00:00Z",
 *   updatedAt: "2024-01-01T00:00:00Z"
 * };
 * ```
 */
export interface Question {
  id: string;
  questionId: string;
  questionText: string;
  topicId: string;
  categoryId: string;
  correctAnswerId: string;
  options: string[];  // Array of option texts
  // Optional fields for different question types
  imageUrl?: string;
  audioUrl?: string;
  readingTextId?: string;
  createdAt: string;  // ISO string date
  updatedAt: string;  // ISO string date
}

/**
 * Represents reading text content for reading comprehension questions
 * 
 * This interface defines the structure of reading materials that accompany
 * reading comprehension questions. Reading texts provide context and content
 * for questions that require understanding of longer passages.
 * 
 * @interface ReadingText
 * @property {string} id - Unique identifier for the reading text
 * @property {string} topicId - ID of the topic this reading text belongs to
 * @property {string} title - Title or heading of the reading text
 * @property {string} textContent - The main content of the reading text
 * @property {string} categoryId - ID of the category this reading text belongs to
 * @property {string} createdAt - ISO timestamp when the reading text was created
 * @property {string} updatedAt - ISO timestamp when the reading text was last updated
 * 
 * @example
 * ```tsx
 * const readingText: ReadingText = {
 *   id: "rt1",
 *   topicId: "german-literature",
 *   title: "The Brothers Grimm",
 *   textContent: "Jacob and Wilhelm Grimm were German academics...",
 *   categoryId: "reading",
 *   createdAt: "2024-01-01T00:00:00Z",
 *   updatedAt: "2024-01-01T00:00:00Z"
 * };
 * ```
 */
export interface ReadingText {
  id: string;
  topicId: string;
  title: string;
  textContent: string;
  categoryId: string;
  createdAt: string;  // ISO string date
  updatedAt: string;  // ISO string date
}

/**
 * Type guard to check if a question has an associated image
 * 
 * Determines whether a question includes an image by checking if the
 * imageUrl property is defined and truthy.
 * 
 * @param {Question} question - The question to check
 * @returns {boolean} True if the question has an image, false otherwise
 * 
 * @example
 * ```tsx
 * if (hasImage(question)) {
 *   // Render image component
 * }
 * ```
 */
export function hasImage(question: Question): boolean {
  return !!question.imageUrl;
}

/**
 * Type guard to check if a question has associated audio
 * 
 * Determines whether a question includes audio by checking if the
 * audioUrl property is defined and truthy.
 * 
 * @param {Question} question - The question to check
 * @returns {boolean} True if the question has audio, false otherwise
 * 
 * @example
 * ```tsx
 * if (hasAudio(question)) {
 *   // Render audio player component
 * }
 * ```
 */
export function hasAudio(question: Question): boolean {
  return !!question.audioUrl;
}

/**
 * Type guard to check if a question is a reading comprehension question
 * 
 * Determines whether a question is a reading question by checking if the
 * readingTextId property is defined and truthy. This type guard also
 * narrows the type to include the reading text relationship.
 * 
 * @param {Question} question - The question to check
 * @returns {boolean} True if the question is a reading question, false otherwise
 * 
 * @example
 * ```tsx
 * if (isReadingQuestion(question)) {
 *   // Access readingTextId property safely
 *   const readingTextId = question.readingTextId;
 * }
 * ```
 */
export function isReadingQuestion(question: Question): question is Question & { readingTextId: ReadingText } {
  return !!question.readingTextId;
}

/**
 * Response structure for quiz questions with pagination support
 * 
 * This interface defines the structure of responses when fetching quiz questions,
 * including the questions themselves and pagination metadata for handling large
 * question sets efficiently.
 * 
 * @interface QuizResponse
 * @property {Question[]} questions - Array of quiz questions for the current page
 * @property {string} [nextCursor] - Optional cursor for fetching the next page of questions
 * @property {boolean} hasMore - Indicates whether more questions are available beyond the current page
 * @property {string} [text] - Optional text content, typically used for reading questions
 * 
 * @example
 * ```tsx
 * const quizResponse: QuizResponse = {
 *   questions: [question1, question2, question3],
 *   nextCursor: "cursor_123",
 *   hasMore: true,
 *   text: "Reading passage content..."
 * };
 * ```
 */
export interface QuizResponse {
  questions: Question[];
  nextCursor?: string;
  hasMore: boolean;
  text?: string;
}

/**
 * Represents a study pace option for personalized learning
 * 
 * This interface defines the structure of study pace options that users
 * can select to customize their learning experience. Study paces determine
 * how quickly users progress through content.
 * 
 * @interface StudyPace
 * @property {string} studyPaceId - Unique identifier for the study pace
 * @property {string} title - Display name of the study pace (e.g., "Slow", "Normal", "Fast")
 * @property {string} description - Detailed description of the study pace and its characteristics
 * 
 * @example
 * ```tsx
 * const studyPace: StudyPace = {
 *   studyPaceId: "slow",
 *   title: "Slow Learner",
 *   description: "Take your time with each concept and practice thoroughly"
 * };
 * ```
 */
export interface StudyPace {
  studyPaceId: string;
  title: string;
  description: string;
}

/**
 * Represents a learning category with progress tracking
 * 
 * This interface defines the structure of learning categories that organize
 * content into logical groups. Categories can track user progress and provide
 * navigation structure for the learning platform.
 * 
 * @interface Category
 * @property {string} categoryId - Unique identifier for the category
 * @property {string} description - Human-readable description of the category
 * @property {number} progress - User's learning progress in this category (0-100)
 * 
 * @example
 * ```tsx
 * const category: Category = {
 *   categoryId: "grammar",
 *   description: "German Grammar Fundamentals",
 *   progress: 75
 * };
 * ```
 */
export interface Category {
  categoryId: string;
  description: string;
  progress: number;
}

/**
 * Represents a learning topic within a category
 * 
 * This interface defines the structure of individual learning topics that
 * belong to categories. Topics are the specific subjects that users study
 * and take quizzes on.
 * 
 * @interface QuizTopic
 * @property {string} topicId - Unique identifier for the topic
 * @property {string} categoryId - ID of the category this topic belongs to
 * 
 * @example
 * ```tsx
 * const topic: QuizTopic = {
 *   topicId: "present-tense",
 *   categoryId: "grammar"
 * };
 * ```
 */
export interface QuizTopic {
  topicId: string;
  categoryId: string;
}

/**
 * User profile information and preferences
 * 
 * This interface defines the structure of user profile data including
 * personal information, learning preferences, and privacy settings.
 * This data is used throughout the application to personalize the user experience.
 * 
 * @interface UserProfile
 * @property {string} name - User's display name
 * @property {number} [studyPaceId] - User's preferred study pace identifier
 * @property {boolean} agreedToTerms - Whether the user has agreed to terms and conditions
 * @property {string} [email] - User's email address
 * @property {string} [level] - User's current learning level
 * @property {boolean} [marketingEmails] - User's preference for marketing emails
 * @property {boolean} [shareDevices] - User's preference for sharing data across devices
 * @property {boolean} [pushNotifications] - User's preference for push notifications
 * 
 * @example
 * ```tsx
 * const userProfile: UserProfile = {
 *   name: "John Doe",
 *   studyPaceId: 2,
 *   agreedToTerms: true,
 *   email: "john@example.com",
 *   level: "intermediate",
 *   marketingEmails: false,
 *   shareDevices: true,
 *   pushNotifications: true
 * };
 * ```
 */
export interface UserProfile {
  name: string;
  studyPaceId?: number;
  agreedToTerms: boolean;
  email?: string;
  level?: string;
  marketingEmails?: boolean;
  shareDevices?: boolean;
  pushNotifications?: boolean;
}

/**
 * Represents a single quiz attempt with score and metadata
 * 
 * This interface defines the structure of quiz attempt records that track
 * user performance and learning progress over time.
 * 
 * @interface QuizAttempt
 * @property {string} id - Unique identifier for the quiz attempt
 * @property {number} score - User's score on the quiz (typically 0-100)
 * @property {string} date - ISO timestamp when the quiz was taken
 * 
 * @example
 * ```tsx
 * const quizAttempt: QuizAttempt = {
 *   id: "attempt_123",
 *   score: 85,
 *   date: "2024-01-15T10:30:00Z"
 * };
 * ```
 */
export interface QuizAttempt {
  id: string;
  score: number;
  date: string;
}

/**
 * Daily quiz time tracking entry
 * 
 * This interface defines the structure of daily quiz time records that
 * track how much time users spend on quizzes each day for analytics
 * and progress monitoring.
 * 
 * @interface DailyQuizTime
 * @property {string} date - ISO date string in YYYY-MM-DD format
 * @property {number} minutes - Number of minutes spent on quizzes that day
 * @property {string} lastUpdated - ISO timestamp when this record was last updated
 * 
 * @example
 * ```tsx
 * const dailyQuizTime: DailyQuizTime = {
 *   date: "2024-01-15",
 *   minutes: 45,
 *   lastUpdated: "2024-01-15T23:59:59Z"
 * };
 * ```
 */
export interface DailyQuizTime {
  date: string; // ISO date string (YYYY-MM-DD)
  minutes: number;
  lastUpdated: string; // ISO timestamp
}

/**
 * Statistics state interface for tracking user learning metrics
 * 
 * This interface defines the structure of the statistics state that
 * tracks various learning metrics including quiz attempts, time spent,
 * and session information for analytics and progress visualization.
 * 
 * @interface StatisticsState
 * @property {QuizAttempt[]} attempts - Array of all quiz attempts
 * @property {number} totalAttempts - Total number of quiz attempts
 * @property {DailyQuizTime[]} dailyQuizTimes - Array of daily quiz time records
 * @property {number} totalQuizMinutes - Total minutes spent on quizzes
 * @property {string | null} currentSessionStart - ISO timestamp when current session started, or null if no active session
 * 
 * @example
 * ```tsx
 * const statisticsState: StatisticsState = {
 *   attempts: [attempt1, attempt2, attempt3],
 *   totalAttempts: 3,
 *   dailyQuizTimes: [dailyTime1, dailyTime2],
 *   totalQuizMinutes: 120,
 *   currentSessionStart: "2024-01-15T10:00:00Z"
 * };
 * ```
 */
export interface StatisticsState {
  attempts: QuizAttempt[];
  totalAttempts: number;
  dailyQuizTimes: DailyQuizTime[];
  totalQuizMinutes: number;
  currentSessionStart: string | null;
}

/**
 * Represents a learning topic with additional metadata
 * 
 * This interface extends the basic topic structure with additional
 * properties for topic ordering and level classification.
 * 
 * @interface Topic
 * @property {string} topicId - Unique identifier for the topic
 * @property {string} categoryId - ID of the category this topic belongs to
 * @property {string} levelId - ID of the difficulty level for this topic
 * @property {number} topicOrder - Ordering position of this topic within its category
 * 
 * @example
 * ```tsx
 * const topic: Topic = {
 *   topicId: "basic-grammar",
 *   categoryId: "grammar",
 *   levelId: "beginner",
 *   topicOrder: 1
 * };
 * ```
 */
export interface Topic {
  topicId: string;
  categoryId: string;
  levelId: string;
  topicOrder: number;
}

/**
 * Content state interface for managing categories and topics
 * 
 * This interface defines the structure of the content state that
 * manages the available categories, topics, and selection state
 * for the learning content navigation.
 * 
 * @interface ContentState
 * @property {Category[]} categories - Array of available categories
 * @property {Topic[]} topics - Array of available topics
 * @property {string | null} lastUpdated - ISO timestamp when content was last updated, or null if never updated
 * @property {string | null} selectedCategoryId - ID of the currently selected category, or null if none selected
 * 
 * @example
 * ```tsx
 * const contentState: ContentState = {
 *   categories: [category1, category2],
 *   topics: [topic1, topic2, topic3],
 *   lastUpdated: "2024-01-15T10:00:00Z",
 *   selectedCategoryId: "grammar"
 * };
 * ```
 */
export interface ContentState {
  categories: Category[];
  topics: Topic[];
  lastUpdated: string | null;
  selectedCategoryId: string | null;
}

// Remove duplicate RootStackParamList and export it from navigation.ts
export type { RootStackParamList } from './navigation';

