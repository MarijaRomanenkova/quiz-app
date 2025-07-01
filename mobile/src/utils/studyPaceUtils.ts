/**
 * @fileoverview Study pace utility functions for the mobile application
 * 
 * This module provides utility functions for study pace management and
 * selection used across the app for consistent study pace handling.
 * 
 * @module utils/studyPaceUtils
 */

import { STUDY_PACES } from '../constants';

/**
 * Handles study pace selection changes
 * 
 * Converts the string value from SegmentedButtons to a number
 * and calls the onPaceChange callback if provided.
 * 
 * @param {string} value - The selected pace ID as a string
 * @param {(paceId: number) => void} onPaceChange - Function called when study pace is changed
 * 
 * @example
 * ```tsx
 * const handleChange = (value: string) => {
 *   handlePaceChange(value, updateStudyPace);
 * };
 * ```
 */
export const handlePaceChange = (
  value: string, 
  onPaceChange?: (paceId: number) => void
): void => {
  onPaceChange?.(parseInt(value));
};

/**
 * Gets the selected study pace object
 * 
 * Finds and returns the study pace object for the given pace ID.
 * 
 * @param {number} currentPaceId - The currently selected study pace ID
 * @returns {Object | undefined} The selected study pace object or undefined if not found
 * 
 * @example
 * ```tsx
 * const selectedPace = getSelectedPace(userStudyPace);
 * if (selectedPace) {
 *   // Selected pace description
 * }
 * ```
 */
export const getSelectedPace = (currentPaceId: number) => {
  return STUDY_PACES.find(pace => pace.studyPaceId === (currentPaceId?.toString() || '1'));
};

/**
 * Validates if a study pace ID is valid
 * 
 * Checks if the given pace ID exists in the available study paces.
 * 
 * @param {number} paceId - The study pace ID to validate
 * @returns {boolean} True if the pace ID is valid, false otherwise
 * 
 * @example
 * ```tsx
 * if (isValidPaceId(userPaceId)) {
 *   // Valid pace ID
 * }
 * ```
 */
export const isValidPaceId = (paceId: number): boolean => {
  return STUDY_PACES.some(pace => parseInt(pace.studyPaceId) === paceId);
}; 
