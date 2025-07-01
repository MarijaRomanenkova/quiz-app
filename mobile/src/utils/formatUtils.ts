/**
 * @fileoverview Formatting utility functions for the mobile application
 * 
 * This module provides common formatting functions used across the app
 * for consistent display of time, percentages, and other formatted data.
 * 
 * @module utils/formatUtils
 */

/**
 * Formats time values from minutes to human-readable format
 * 
 * Converts minutes to hours and minutes format for better readability.
 * Examples: 45 → "45 min", 90 → "1h 30min"
 * 
 * @param {number} minutes - The time value in minutes
 * @returns {string} Formatted time string (e.g., "1h 30min" or "45 min")
 * 
 * @example
 * ```tsx
 * formatTime(45) // "45 min"
 * formatTime(90) // "1h 30min"
 * formatTime(125) // "2h 5min"
 * ```
 */
export const formatTime = (minutes: number): string => {
  if (minutes < 60) return `${Math.round(minutes)} min`;
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return `${hours}h ${mins}min`;
};

/**
 * Formats goal percentage for display
 * 
 * Converts percentage values to descriptive text showing progress
 * relative to the target (100%).
 * 
 * @param {number} percentage - The percentage value (0-200+)
 * @returns {string} Formatted percentage description
 * 
 * @example
 * ```tsx
 * formatGoalPercentage(75) // "-25 % of the target"
 * formatGoalPercentage(100) // "100 % of target"
 * formatGoalPercentage(120) // "+20 % of the target"
 * ```
 */
export const formatGoalPercentage = (percentage: number): string => {
  if (percentage > 100) {
    return `+${percentage - 100} % of the target`;
  } else if (percentage < 100) {
    return `-${100 - percentage} % of the target`;
  } else {
    return '100 % of target';
  }
}; 
