/**
 * Application constants and configuration
 * 
 * This module centralizes all constants, magic numbers, and configuration
 * values used throughout the app to eliminate duplication and improve maintainability.
 * 
 * @module constants/appConstants
 */

/**
 * API configuration constants
 */
export const API_CONFIG = {
  TIMEOUT: 10000,
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
} as const;

/**
 * Form validation constants
 */
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  NAME_MIN_LENGTH: 2,
  USERNAME_MIN_LENGTH: 3,
  STUDY_PACE_MIN: 1,
  STUDY_PACE_MAX: 3,
} as const;

/**
 * UI constants
 */
export const UI = {
  BUTTON_HEIGHT: 56,
  BORDER_RADIUS: 20,
  CARD_BORDER_RADIUS: 15,
  SHADOW_OPACITY: 0.15,
  SHADOW_RADIUS: 8,
  ELEVATION: 4,
} as const;

/**
 * Animation constants
 */
export const ANIMATION = {
  DURATION: 300,
  SPRING_CONFIG: {
    tension: 100,
    friction: 8,
  },
} as const;

/**
 * Storage keys for AsyncStorage
 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  SETTINGS: 'app_settings',
  STATISTICS: 'statistics_data',
} as const;

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network connection error. Please check your internet connection.',
  AUTH_ERROR: 'Authentication failed. Please log in again.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
  EMAIL_EXISTS: 'User with this email already exists',
  INVALID_CREDENTIALS: 'Invalid email or password',
} as const;

/**
 * Success messages
 */
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful',
  REGISTRATION_SUCCESS: 'Registration successful. Please check your email to verify your account.',
  PASSWORD_RESET_SENT: 'Password reset email sent successfully.',
  PROFILE_UPDATED: 'Profile updated successfully',
} as const;

/**
 * Study pace options
 */
export const STUDY_PACES = {
  RELAXED: { id: 1, name: 'Relaxed', description: 'Take your time' },
  MODERATE: { id: 2, name: 'Moderate', description: 'Balanced pace' },
  INTENSIVE: { id: 3, name: 'Intensive', description: 'Fast-paced learning' },
} as const;

/**
 * Quiz configuration
 */
export const QUIZ_CONFIG = {
  QUESTIONS_PER_QUIZ: 10,
  TIME_LIMIT_PER_QUESTION: 30, // seconds
  PASSING_SCORE: 70, // percentage
} as const;

/**
 * Font sizes
 */
export const FONT_SIZES = {
  XS: 12,
  SM: 14,
  MD: 16,
  LG: 18,
  XL: 20,
  XXL: 24,
  XXXL: 32,
  HUGE: 72,
} as const;

/**
 * Spacing values
 */
export const SPACING = {
  XS: 4,
  SM: 8,
  MD: 16,
  LG: 24,
  XL: 32,
  XXL: 48,
} as const; 
