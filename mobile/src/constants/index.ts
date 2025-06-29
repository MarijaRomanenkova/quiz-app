/**
 * @fileoverview Application constants and predefined data
 * 
 * This module contains application-wide constants and predefined data structures
 * that are used throughout the application. These constants provide consistent
 * values and options for various features like study pace selection.
 * 
 * All constants are marked as const to ensure immutability and prevent
 * accidental modifications during runtime.
 * 
 * @module constants
 */

import type { StudyPace } from '../types';

/**
 * Available study pace options for user preference selection
 * 
 * Defines the three study pace levels available to users, each with
 * a unique identifier, display title, and description of the expected
 * learning timeline. These options are used in the StudyPaceSelector
 * component and stored in user preferences.
 * 
 * @type {StudyPace[]}
 * @const
 * 
 * @property {StudyPace[]} STUDY_PACES - Array of study pace options
 * @property {string} STUDY_PACES[].studyPaceId - Unique identifier for the study pace
 * @property {string} STUDY_PACES[].title - Display name for the study pace
 * @property {string} STUDY_PACES[].description - Description of the learning timeline
 * 
 * @example
 * ```tsx
 * import { STUDY_PACES } from '../constants';
 * 
 * // Find a specific study pace
 * const relaxedPace = STUDY_PACES.find(pace => pace.studyPaceId === '1');
 * 
 * // Use in components
 * <StudyPaceSelector
 *   currentPaceId={userStudyPace}
 *   onPaceChange={handlePaceChange}
 * />
 * ```
 * 
 * @example
 * ```tsx
 * // Map study paces to display options
 * const paceOptions = STUDY_PACES.map(pace => ({
 *   label: pace.title,
 *   value: pace.studyPaceId,
 *   description: pace.description
 * }));
 * ```
 */
export const STUDY_PACES: StudyPace[] = [
  { studyPaceId: '1', title: 'Relaxed', description: 'A1 level in 12 weeks' },
  { studyPaceId: '2', title: 'Moderate', description: 'A1 level in 6 weeks' },
  { studyPaceId: '3', title: 'Intensive', description: 'A1 level in 3 weeks' }
] as const;

