import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Surface, Text } from 'react-native-paper';
import { theme } from '../../theme';

interface ReadingTextProps {
  text: {
    title: string;
    text: string;
  };
}

export const ReadingText: React.FC<ReadingTextProps> = ({ text }) => {
  return (
    <Surface style={[styles.questionCard, styles.fullScreenCard]}>
      <View style={styles.questionContent}>
        <Text variant="headlineSmall" style={styles.readingTitle}>
          {text.title}
        </Text>
        <Text variant="bodyLarge" style={styles.readingText}>
          {text.text}
        </Text>
      </View>
    </Surface>
  );
};

const styles = StyleSheet.create({
  questionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000000',
    shadowOpacity: 0.15,
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowRadius: 50,
    elevation: 8,
  },
  fullScreenCard: {
    flex: 1,
    margin: 0,
    borderRadius: 0,
  },
  questionContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  readingTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginBottom: 16,
  },
  readingText: {
    fontSize: 18,
    lineHeight: 28,
    color: theme.colors.onSurface,
  },
});

