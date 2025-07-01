import { Alert } from 'react-native';

/**
 * Utility functions for API operations
 * 
 * This module provides reusable functions for common API operations
 * to eliminate duplication and improve error handling across the app.
 * 
 * @module utils/apiUtils
 */

/**
 * Handles API errors with consistent error messaging
 * 
 * @param error - The error object from API calls
 * @param defaultMessage - Default error message if error is not an Error instance
 * @param showAlert - Whether to show an alert dialog (default: true)
 * @returns The error message string
 * 
 * @example
 * ```tsx
 * try {
 *   await apiCall();
 * } catch (error) {
 *   const message = handleApiError(error, 'Operation failed');
 *   // Handle error message
 * }
 * ```
 */
export const handleApiError = (
  error: unknown,
  defaultMessage: string = 'An error occurred',
  showAlert: boolean = true
): string => {
  const message = error instanceof Error ? error.message : defaultMessage;
  
  if (showAlert) {
    Alert.alert('Error', message, [{ text: 'OK' }]);
  }
  
  console.error('API Error:', error);
  return message;
};

/**
 * Makes a fetch request with consistent error handling
 * 
 * @param url - The URL to fetch from
 * @param options - Fetch options
 * @param token - Optional authentication token
 * @returns Promise with the response data
 * 
 * @example
 * ```tsx
 * const data = await fetchWithAuth('/api/user', { method: 'GET' }, token);
 * ```
 */
export const fetchWithAuth = async (
  url: string,
  options: RequestInit = {},
  token?: string | null
): Promise<any> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
};

/**
 * Debounces function calls to prevent excessive API requests
 * 
 * @param func - The function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function
 * 
 * @example
 * ```tsx
 * const debouncedSearch = debounce(searchFunction, 300);
 * ```
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Retries a function with exponential backoff
 * 
 * @param fn - The function to retry
 * @param maxRetries - Maximum number of retries (default: 3)
 * @param baseDelay - Base delay in milliseconds (default: 1000)
 * @returns Promise with the function result
 * 
 * @example
 * ```tsx
 * const result = await retryWithBackoff(async () => {
 *   return await apiCall();
 * });
 * ```
 */
export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  let lastError: Error;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError!;
}; 
