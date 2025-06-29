/**
 * @fileoverview User type definitions for the mobile application
 * 
 * This module contains TypeScript type definitions for user-related data
 * structures, including user profiles, authentication data, and preferences.
 * These types ensure type safety when working with user data throughout
 * the application.
 * 
 * The module includes:
 * - User interface with authentication and profile data
 * - User preferences and settings
 * - Account verification status
 * 
 * @module types/user
 */

/**
 * Represents a user account with complete profile information
 * 
 * This interface defines the structure of user data including authentication
 * details, profile information, learning preferences, and account status.
 * This data is used throughout the application for personalization and
 * user management.
 * 
 * @interface User
 * @property {string} id - Unique database identifier for the user
 * @property {string} email - User's email address (used for authentication)
 * @property {string} username - User's display name or username
 * @property {string} levelId - User's current learning level identifier
 * @property {number} studyPaceId - User's preferred study pace identifier
 * @property {boolean} agreedToTerms - Whether the user has agreed to terms and conditions
 * @property {boolean} marketingEmails - User's preference for receiving marketing emails
 * @property {boolean} shareDevices - User's preference for sharing data across devices
 * @property {boolean} emailVerified - Whether the user's email address has been verified
 * 
 * @example
 * ```tsx
 * const user: User = {
 *   id: "user_123",
 *   email: "john.doe@example.com",
 *   username: "johndoe",
 *   levelId: "intermediate",
 *   studyPaceId: 2,
 *   agreedToTerms: true,
 *   marketingEmails: false,
 *   shareDevices: true,
 *   emailVerified: true
 * };
 * ```
 */
export interface User {
  id: string;
  email: string;
  username: string;
  levelId: string;
  studyPaceId: number;
  agreedToTerms: boolean;
  marketingEmails: boolean;
  shareDevices: boolean;
  emailVerified: boolean;
} 
