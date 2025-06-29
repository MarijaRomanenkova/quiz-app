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
  /**
   * Handles study pace selection changes
   * 
   * Converts the string value from SegmentedButtons to a number
   * and calls the onPaceChange callback if provided.
   * 
   * @param {string} value - The selected pace ID as a string
   */
  const handlePaceChange = (value: string) => {
    onPaceChange?.(parseInt(value));
  };

  const selectedPace = STUDY_PACES.find(pace => pace.studyPaceId === (currentPaceId?.toString() || '1'));

  return (
    <View style={styles.container}>
      <SegmentedButtons
        value={(currentPaceId || 1).toString()}
        onValueChange={handlePaceChange}
        buttons={STUDY_PACES.map(pace => ({
          value: pace.studyPaceId,
          label: pace.title,
          style: styles.button,
          icon: (currentPaceId || 1) === parseInt(pace.studyPaceId) ? 'check' : undefined,
        }))}
        style={styles.segmentedButtons}
        theme={{
          colors: {
            secondaryContainer: '#EDE7FF',
            onSecondaryContainer: '#000000',
            primary: '#EDE7FF',
            onPrimary: '#000000',
            onSurface: '#FFFFFF',
          },
        }}
      />
      <Text style={styles.description}>{selectedPace?.description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  segmentedButtons: {
    width: '100%',
    backgroundColor: 'transparent',
  },
  button: {
    flex: 1,
    borderColor: theme.colors.surface,
  },
  description: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Baloo2-Regular',
    textAlign: 'center',
    marginTop: 8,
  },
}); 
