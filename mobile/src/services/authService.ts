import { API_URL } from '../config/index';

/**
 * Interface for user login credentials
 */
interface LoginCredentials {
  /** User's email address */
  email: string;
  /** User's password */
  password: string;
}

/**
 * Interface for user registration data
 */
interface RegisterData {
  /** User's email address */
  email: string;
  /** User's password */
  password: string;
  /** User's display name */
  username: string;
  /** User's preferred study pace setting */
  studyPaceId: number;
  /** Whether the user has agreed to terms and conditions */
  agreedToTerms: boolean;
}

/**
 * Interface for authentication response from the server
 */
interface AuthResponse {
  /** JWT access token for API authentication */
  access_token: string;
  /** User data returned from the server */
  user: {
    /** Unique identifier for the user */
    id: string;
    /** User's email address */
    email: string;
    /** User's display name */
    username: string;
    /** Whether the user's email has been verified */
    emailVerified: boolean;
    /** Current level/grade of the user */
    levelId: string;
  };
}

/**
 * Authentication service for handling user authentication operations
 * 
 * This service provides methods for user login, registration, email verification,
 * and other authentication-related API calls.
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
   *   console.log('Login successful:', response.access_token);
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
   *   console.log('Registration successful:', result.message);
   * } catch (error) {
   *   console.error('Registration failed:', error.message);
   * }
   * ```
   */
  async register(data: RegisterData): Promise<{ message: string }> {
    try {
      console.log('Attempting registration with:', { ...data, password: '[REDACTED]' });
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to parse error response' }));
        console.error('Registration failed:', errorData);
        throw new Error(errorData.message || 'Registration failed');
      }
      
      const result = await response.json();
      console.log('Registration successful:', result);
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
   *   console.log('Email verified:', result.message);
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
   *   console.log('Verification email resent:', result.message);
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
