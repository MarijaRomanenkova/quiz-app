import { API_URL } from '../config';
import { 
  LoginCredentials, 
  RegisterData, 
  AuthResponse
} from '../types/auth.types';

/**
 * Authentication service for handling user login, registration, and profile management
 * 
 * This service provides methods for user authentication, including login,
 * registration, password reset, and profile updates. It handles API communication
 * with the backend authentication endpoints.
 */
const authService = {
  /**
   * Authenticates a user with email and password
   * 
   * @param credentials - User's login credentials
   * @returns Promise resolving to authentication response with token and user data
   * @throws Error if login fails or network error occurs
   * 
   * @example
   * ```typescript
   * try {
   *   const response = await authService.login({
   *     email: 'user@example.com',
   *     password: 'password123'
   *   });
   *   // Login successful
   * } catch (error) {
   *   console.error('Login failed:', error.message);
   * }
   * ```
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }
      
      return response.json();
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  /**
   * Registers a new user account
   * 
   * @param data - User registration data including email, password, username, and preferences
   * @returns Promise resolving to success message
   * @throws Error if registration fails or network error occurs
   * 
   * @example
   * ```typescript
   * try {
   *   const result = await authService.register({
   *     email: 'newuser@example.com',
   *     password: 'password123',
   *     username: 'newuser',
   *     studyPaceId: 1,
   *     agreedToTerms: true
   *   });
   *   // Registration successful
   * } catch (error) {
   *   console.error('Registration failed:', error.message);
   * }
   * ```
   */
  async register(data: RegisterData): Promise<{ message: string }> {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to parse error response' }));
        throw new Error(errorData.message || 'Registration failed');
      }
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  /**
   * Verifies a user's email address using a verification token
   * 
   * @param token - Email verification token received via email
   * @returns Promise resolving to success message
   * @throws Error if verification fails or network error occurs
   * 
   * @example
   * ```typescript
   * try {
   *   const result = await authService.verifyEmail('verification-token-here');
   *   // Email verified
   * } catch (error) {
   *   console.error('Email verification failed:', error.message);
   * }
   * ```
   */
  async verifyEmail(token: string): Promise<{ message: string }> {
    const response = await fetch(`${API_URL}/auth/verify-email/${token}`, {
      method: 'POST',
    });
    
    if (!response.ok) {
      throw new Error('Email verification failed');
    }
    
    return response.json();
  },

  /**
   * Resends email verification to a user's email address
   * 
   * @param email - Email address to resend verification to
   * @returns Promise resolving to success message
   * @throws Error if resend fails or network error occurs
   * 
   * @example
   * ```typescript
   * try {
   *   const result = await authService.resendVerification('user@example.com');
   *   // Verification email resent
   * } catch (error) {
   *   console.error('Failed to resend verification:', error.message);
   * }
   * ```
   */
  async resendVerification(email: string): Promise<{ message: string }> {
    const response = await fetch(`${API_URL}/auth/resend-verification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to resend verification email');
    }
    
    return response.json();
  },
};

export default authService; 
