import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
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
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={true}
        >
          <Text variant="bodyLarge" style={styles.readingText}>
            {text.text}
          </Text>
        </ScrollView>
      </View>
    </Surface>
  );
};

const styles = StyleSheet.create({
  questionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 24,
    marginVertical: 12,
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
    borderRadius: 15,
  },
  questionContent: {
    flex: 1,
    width: '100%',
  },
  readingTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
    paddingHorizontal: 8,
  },
  readingText: {
    fontSize: 18,
    lineHeight: 28,
    color: theme.colors.onSurface,
    textAlign: 'justify',
    paddingHorizontal: 8,
  },
});

