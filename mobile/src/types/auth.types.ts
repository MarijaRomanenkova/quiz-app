/**
 * @fileoverview Authentication-related type definitions for the mobile application
 * 
 * This module contains TypeScript type definitions for authentication-related data
 * structures, including login credentials, registration data, and authentication
 * responses. These types ensure type safety when working with authentication
 * data throughout the application.
 * 
 * The module includes:
 * - Login and registration data types
 * - Authentication response types
 * - Profile update data types
 * 
 * @module types/auth
 */

/**
 * User login credentials
 * 
 * @interface LoginCredentials
 * @property {string} email - User's email address
 * @property {string} password - User's password
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * User registration data
 * 
 * @interface RegisterData
 * @property {string} email - User's email address
 * @property {string} password - User's password
 * @property {string} username - User's display name
 * @property {number} studyPaceId - User's preferred study pace
 * @property {boolean} agreedToTerms - Whether user agreed to terms
 */
export interface RegisterData {
  email: string;
  password: string;
  username: string;
  studyPaceId: number;
  agreedToTerms: boolean;
}

/**
 * Authentication response from backend
 * 
 * @interface AuthResponse
 * @property {string} access_token - JWT token for API authentication
 * @property {User} user - User profile data
 */
export interface AuthResponse {
  access_token: string;
  user: User;
}

/**
 * Profile update data for user preferences
 * 
 * @interface ProfileUpdateData
 * @property {number} studyPaceId - Study pace preference
 * @property {boolean} marketingEmails - Marketing email consent
 * @property {boolean} shareDevices - Device sharing preference
 */
export interface ProfileUpdateData {
  studyPaceId: number;
  marketingEmails: boolean;
  shareDevices: boolean;
}

// Import User type from user types
import type { User } from './user.types'; 
