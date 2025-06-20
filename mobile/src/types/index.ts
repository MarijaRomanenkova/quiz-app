/**
 * Represents a quiz question
 * @interface Question
 * @property {string} QuestionId - Unique identifier for the question
 * @property {'text' | 'image' | 'audio' | 'trueFalse' | 'reading'} type - Type of question (text, image, audio, true/false, or reading)
 * @property {string} content - Question content or image URL
 * @property {string} questionText - Text content of the question
 * @property {string[]} options - Array of possible answers
 * @property {string} correctAnswerId - ID of the correct answer
 * @property {number} points - Points awarded for correct answer
 * @property {string} topicId - ID of the topic this question belongs to
 * @property {string} topic - Topic of the question
 * @property {string} title - Title of the reading question
 * @property {string} text - Text content of the reading question
 */

/**
 * Base question type that matches our database structure
 * Every question has text content, and may have additional media or reading text
 */
export interface Question {
  id: string;
  questionId: string;
  questionText: string;
  points: number;
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
 * Reading text type
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
 * Type guard to check if a question has an image
 */
export function hasImage(question: Question): boolean {
  return !!question.imageUrl;
}

/**
 * Type guard to check if a question has audio
 */
export function hasAudio(question: Question): boolean {
  return !!question.audioUrl;
}

/**
 * Type guard to check if a question is a reading question
 */
export function isReadingQuestion(question: Question): question is Question & { readingTextId: ReadingText } {
  return !!question.readingTextId;
}

/**
 * Response structure for quiz questions with pagination
 * @interface QuizResponse
 * @property {Question[]} questions - Array of quiz questions
 * @property {string} [nextCursor] - Optional cursor for pagination
 * @property {boolean} hasMore - Indicates if more questions are available
 */
export interface QuizResponse {
  questions: Question[];
  nextCursor?: string;
  hasMore: boolean;
  text?: string;
}

/**
 * Study pace structure
 * @interface StudyPace
 * @property {string} studyPaceId - Unique identifier for the study pace
 * @property {string} title - Display name of the study pace
 */
export interface StudyPace {
  studyPaceId: string;
  title: string;
  description: string;
}

/**
 * Category structure
 * @interface Category
 * @property {string} categoryId - Unique identifier for the category
 * @property {string} description - Category description
 * @property {number} progress - Learning progress (0-100)
 */
export interface Category {
  categoryId: string;
  description: string;
  progress: number;
}

/**
 * Represents a learning topic within a category
 * @interface QuizTopic
 * @property {string} topicId - Unique identifier for the topic
 * @property {string} categoryId - Category this topic belongs to
 */
export interface QuizTopic {
  topicId: string;
  categoryId: string;
}

/**
 * User profile information
 * @interface UserProfile
 * @property {string} name - User's name
 * @property {StudyPaceId} studyPaceId - User's preferred study pace Id
 * @property {boolean} agreedToTerms - User's agreement to terms
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

export interface QuizAttempt {
  id: string;
  score: number;
  date: string;
}

export interface Topic {
  topicId: string;
  categoryId: string;
  levelId: string;
  topicOrder: number;
}

export interface ContentState {
  categories: Category[];
  topics: Topic[];
  lastUpdated: string | null;
  selectedCategoryId: string | null;
}

// Remove duplicate RootStackParamList and export it from navigation.ts
export type { RootStackParamList } from './navigation';

