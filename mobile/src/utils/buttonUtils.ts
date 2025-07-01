/**
 * @fileoverview Button utility functions for the mobile application
 * 
 * This module provides utility functions for button styling and color management
 * used across the app for consistent button appearance.
 * 
 * @module utils/buttonUtils
 */

/**
 * Available button variants with their respective color schemes
 * 
 * @typedef {'success' | 'primary' | 'secondary'} ButtonVariant
 */
export type ButtonVariant = 'success' | 'primary' | 'secondary';

/**
 * Gets the appropriate colors for a button variant and state
 * 
 * Returns the background and text colors for a given button variant,
 * handling both enabled and disabled states.
 * 
 * @param {ButtonVariant} variant - The button variant
 * @param {boolean} [disabled=false] - Whether the button is disabled
 * @returns {Object} Object containing backgroundColor and textColor
 * @returns {string} returns.backgroundColor - The background color hex code
 * @returns {string} returns.textColor - The text color hex code
 * 
 * @example
 * ```tsx
 * const colors = getButtonColors('success', false);
 * // { backgroundColor: '#8BF224', textColor: '#000000' }
 * 
 * const disabledColors = getButtonColors('primary', true);
 * // { backgroundColor: '#CCCCCC', textColor: '#666666' }
 * ```
 */
export const getButtonColors = (variant: ButtonVariant, disabled: boolean = false) => {
  if (disabled) {
    return {
      backgroundColor: '#CCCCCC', // gray when disabled
      textColor: '#666666',
    };
  }

  switch (variant) {
    case 'success':
      return {
        backgroundColor: '#8BF224', // bright green
        textColor: '#000000',
      };
    case 'primary':
      return {
        backgroundColor: '#4313E2', // deep violet
        textColor: '#FFFFFF', // white
      };
    case 'secondary':
      return {
        backgroundColor: '#EDE7FF', // pale violet
        textColor: '#000000', // black
      };
  }
}; 
