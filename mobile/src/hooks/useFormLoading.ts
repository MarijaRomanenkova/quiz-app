/**
 * @fileoverview Form Loading State Management Hook
 * 
 * This hook provides a reusable way to handle loading states during
 * form submissions, eliminating code duplication across forms and
 * providing consistent loading behavior throughout the application.
 * 
 * The hook offers multiple approaches to managing loading states:
 * - Manual start/stop control
 * - Automatic loading wrapper for async functions
 * - Consistent loading state management
 * 
 * Key Features:
 * - Manual loading state control
 * - Automatic loading wrapper for async operations
 * - Consistent loading behavior across forms
 * - Error handling integration
 * 
 * @module hooks/useFormLoading
 */

import { useState, useCallback } from 'react';

/**
 * Custom hook for managing form loading states
 * 
 * This hook provides a reusable way to handle loading states during
 * form submissions, eliminating code duplication across forms and
 * providing consistent loading behavior throughout the application.
 * 
 * The hook offers three main functions:
 * - startLoading/stopLoading: Manual control over loading state
 * - withLoading: Automatic wrapper for async functions
 * - isLoading: Current loading state for UI rendering
 * 
 * @returns {Object} Object containing loading state and management functions
 * @returns {boolean} returns.isLoading - Current loading state
 * @returns {() => void} returns.startLoading - Function to start loading
 * @returns {() => void} returns.stopLoading - Function to stop loading
 * @returns {(asyncFunction: () => Promise<void>) => Promise<void>} returns.withLoading - Wrapper for async functions
 * 
 * @example
 * ```tsx
 * // Basic usage with manual control
 * const { isLoading, startLoading, stopLoading } = useFormLoading();
 * 
 * const handleSubmit = async (data) => {
 *   startLoading();
 *   try {
 *     await submitForm(data);
 *     // Handle success
 *   } catch (error) {
 *     // Handle error
 *   } finally {
 *     stopLoading();
 *   }
 * };
 * ```
 * 
 * @example
 * ```tsx
 * // Usage with automatic loading wrapper
 * const { isLoading, withLoading } = useFormLoading();
 * 
 * const handleSubmit = async (data) => {
 *   await withLoading(async () => {
 *     await submitForm(data);
 *     // Loading state is automatically managed
 *   });
 * };
 * 
 * return (
 *   <Button 
 *     onPress={() => handleSubmit(formData)}
 *     disabled={isLoading}
 *   >
 *     {isLoading ? 'Submitting...' : 'Submit'}
 *   </Button>
 * );
 * ```
 * 
 * @example
 * ```tsx
 * // Usage with error handling
 * const { isLoading, withLoading } = useFormLoading();
 * const [error, setError] = useState(null);
 * 
 * const handleSubmit = async (data) => {
 *   setError(null);
 *   await withLoading(async () => {
 *     try {
 *       await submitForm(data);
 *       // Handle success
 *     } catch (err) {
 *       setError(err.message);
 *       throw err; // Re-throw to let withLoading handle the finally block
 *     }
 *   });
 * };
 * ```
 */
export const useFormLoading = () => {
  const [isLoading, setIsLoading] = useState(false);

  const startLoading = useCallback(() => {
    setIsLoading(true);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  const withLoading = useCallback(async (asyncFunction: () => Promise<void>) => {
    try {
      startLoading();
      await asyncFunction();
    } finally {
      stopLoading();
    }
  }, [startLoading, stopLoading]);

  return {
    /** Current loading state */
    isLoading,
    /** Function to manually start loading state */
    startLoading,
    /** Function to manually stop loading state */
    stopLoading,
    /** Wrapper function that automatically manages loading state for async operations */
    withLoading,
  };
}; 
