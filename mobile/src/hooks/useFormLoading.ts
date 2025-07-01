import { useState, useCallback } from 'react';

/**
 * Custom hook for managing form loading states
 * 
 * This hook provides a reusable way to handle loading states during
 * form submissions, eliminating code duplication across forms.
 * 
 * @returns Object containing loading state and management functions
 * 
 * @example
 * ```tsx
 * const { isLoading, startLoading, stopLoading, withLoading } = useFormLoading();
 * 
 * const handleSubmit = async (data) => {
 *   await withLoading(async () => {
 *     await submitForm(data);
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
    isLoading,
    startLoading,
    stopLoading,
    withLoading,
  };
}; 
