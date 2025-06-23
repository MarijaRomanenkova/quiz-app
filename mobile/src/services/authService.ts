import { API_URL } from '../config/index';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  username: string;
  studyPaceId: number;
  agreedToTerms: boolean;
}

interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    username: string;
    emailVerified: boolean;
    levelId: string;
  };
}

const authService = {
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

  async verifyEmail(token: string): Promise<{ message: string }> {
    const response = await fetch(`${API_URL}/auth/verify-email/${token}`, {
      method: 'POST',
    });
    
    if (!response.ok) {
      throw new Error('Email verification failed');
    }
    
    return response.json();
  },

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
