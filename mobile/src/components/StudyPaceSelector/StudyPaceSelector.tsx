/**
 * @fileoverview Study Pace Selector component for the mobile application
 * 
 * This component provides a segmented button interface for selecting study pace
 * preferences. It displays predefined study pace options with descriptions
 * and allows users to change their learning speed preference.
 * 
 * The component uses react-native-paper's SegmentedButtons for consistent
 * styling and provides visual feedback with check icons for the selected option.
 * 
 * @module components/StudyPaceSelector
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SegmentedButtons, Text } from 'react-native-paper';
import { theme } from '../../theme';
import { STUDY_PACES } from '../../constants';
import { handlePaceChange, getSelectedPace } from '../../utils/studyPaceUtils';

/**
 * Props interface for the StudyPaceSelector component
 * 
 * @interface StudyPaceSelectorProps
 * @property {number} currentPaceId - The currently selected study pace ID
 * @property {(paceId: number) => void} [onPaceChange] - Function called when study pace is changed
 */
interface StudyPaceSelectorProps {
  currentPaceId: number;
  onPaceChange?: (paceId: number) => void;
}

/**
 * Study Pace Selector component with segmented buttons
 * 
 * Provides a user interface for selecting study pace preferences with
 * segmented buttons and descriptive text. The component displays all
 * available study pace options from the constants and shows a description
 * for the currently selected option.
 * 
 * @param {StudyPaceSelectorProps} props - The study pace selector props
 * @param {number} props.currentPaceId - The currently selected study pace ID
 * @param {(paceId: number) => void} [props.onPaceChange] - Function called when study pace is changed
 * @returns {JSX.Element} A segmented button selector with study pace options
 * 
 * @example
 * ```tsx
 * <StudyPaceSelector
 *   currentPaceId={userStudyPace}
 *   onPaceChange={(paceId) => updateStudyPace(paceId)}
 * />
 * ```
 * 
 * @example
 * ```tsx
 * <StudyPaceSelector currentPaceId={1} />
 * ```
 */
export const StudyPaceSelector = ({ currentPaceId, onPaceChange }: StudyPaceSelectorProps) => {
  const selectedPace = getSelectedPace(currentPaceId);

  return (
    <View style={styles.container} testID="study-pace-selector">
      <SegmentedButtons
        value={(currentPaceId || 1).toString()}
        onValueChange={(value) => handlePaceChange(value, onPaceChange)}
        buttons={STUDY_PACES.map(pace => ({
          value: pace.studyPaceId,
          label: pace.title,
          style: styles.button,
          icon: (currentPaceId || 1) === parseInt(pace.studyPaceId) ? 'check' : undefined,
        }))}
        style={styles.segmentedButtons}
        theme={{
          colors: {
            secondaryContainer: theme.colors.secondaryContainer,
            onSecondaryContainer: theme.colors.onSecondaryContainer,
            primary: theme.colors.primary,
            onPrimary: theme.colors.onSecondaryContainer,
            onSurface: theme.colors.surface,
          },
        }}
      />
      <Text style={styles.description}>{selectedPace?.description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    borderColor: theme.colors.surface,
    flex: 1,
  },
  container: {
    alignItems: 'center',
    width: '100%',
  },
  description: {
    color: theme.colors.surface,
    fontFamily: 'Baloo2-Regular',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  segmentedButtons: {
    backgroundColor: theme.colors.transparent,
    width: '100%',
  },
}); 
