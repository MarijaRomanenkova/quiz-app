/**
 * Represents a quiz question
 * @interface Question
 * @property {string} QuestionId - Unique identifier for the question
 * @property {'text' | 'image'} type - Type of question (text or image based)
 * @property {string} content - Question content or image URL
 * @property {string[]} options - Array of possible answers
 * @property {string} correctAnswerId - ID of the correct answer
 * @property {number} points - Points awarded for correct answer
 * @property {string} topicId - ID of the topic this question belongs to
 */
export interface Question {
  questionId: string;
  type: 'text' | 'image' | 'audio' | 'trueFalse';
  content: string;
  options: string[];
  correctAnswerId: string;
  points: number;
  topicId: string;
}

export interface ReadingText {
  topicId: string;
  title: string;
  text: string;
  categoryId: string;
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
 * @property {categoryId} categoryId - Unique identifier for the category
 * @property {string} title - Display name of the category
 * @property {string} description - Category description
 * @property {number} progress - Learning progress (0-100)
 */
export interface Category {
  categoryId: string;
  title: string;
  description: string;
  progress: number;
}

/**
 * Represents a learning topic within a category
 * @interface QuizTopic
 * @property {string} topicId - Unique identifier for the topic
 * @property {string} title - Display name of the topic
 * @property {string} text - Text content of the topic
 * @property {Category} categoryId - Category this topic belongs to
 */
export interface QuizTopic {
  topicId: string;
  title: string;
  text?: string; 
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
  level?: number;
  marketingEmails?: boolean;
  shareDevices?: boolean;
  pushNotifications?: boolean;
}

export interface QuizAttempt {
  id: string;
  score: number;
  date: string;
}

// Remove duplicate RootStackParamList and export it from navigation.ts
export type { RootStackParamList } from './navigation';

