import type { StudyPace } from '../types';

/**
 * Available study pace options
 * @const
 */
export const STUDY_PACES: StudyPace[] = [
  { studyPaceId: '1', title: 'Relaxed', description: 'A1 level in 12 weeks' },
  { studyPaceId: '2', title: 'Moderate', description: 'A1 level in 6 weeks' },
  { studyPaceId: '3', title: 'Intensive', description: 'A1 level in 3 weeks' }
] as const;

