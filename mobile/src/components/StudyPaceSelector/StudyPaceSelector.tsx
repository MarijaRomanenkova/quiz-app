import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SegmentedButtons, Text } from 'react-native-paper';
import { theme } from '../../theme';
import { STUDY_PACES } from '../../constants';

interface StudyPaceSelectorProps {
  currentPaceId: number;
  onPaceChange?: (paceId: number) => void;
}

export const StudyPaceSelector = ({ currentPaceId, onPaceChange }: StudyPaceSelectorProps) => {
  const handlePaceChange = (value: string) => {
    onPaceChange?.(parseInt(value));
  };

  const selectedPace = STUDY_PACES.find(pace => pace.studyPaceId === currentPaceId.toString());

  return (
    <View style={styles.container}>
      <SegmentedButtons
        value={currentPaceId.toString()}
        onValueChange={handlePaceChange}
        buttons={STUDY_PACES.map(pace => ({
          value: pace.studyPaceId,
          label: pace.title,
          style: styles.button,
          icon: currentPaceId === parseInt(pace.studyPaceId) ? 'check' : undefined,
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
