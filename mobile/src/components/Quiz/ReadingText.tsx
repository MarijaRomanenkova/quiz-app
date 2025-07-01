import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Surface, Text } from 'react-native-paper';
import { theme, spacing, layout } from '../../theme';
import { createTextStyles, createShadowStyles } from '../../utils/themeUtils';
import { ReadingTextProps } from '../../types/components.types';

// Create utility styles
const titleStyles = createTextStyles('xlarge', 'semiBold', theme.colors.onSurface);
const textStyles = createTextStyles('large', 'regular', theme.colors.onSurface);
const shadowStyles = createShadowStyles('large');

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
  fullScreenCard: {
    borderRadius: layout.borderRadius.medium,
    flex: 1,
    margin: 0,
  },
  questionCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: layout.borderRadius.medium,
    flex: 1,
    marginVertical: spacing.md,
    padding: spacing.xl,
    ...shadowStyles.shadow,
  },
  questionContent: {
    flex: 1,
    width: '100%',
  },
  readingText: {
    ...textStyles.text,
    lineHeight: 28,
    paddingHorizontal: spacing.sm,
    textAlign: 'justify',
  },
  readingTitle: {
    ...titleStyles.text,
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.sm,
    textAlign: 'center',
  },
  scrollContent: {
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.sm,
  },
  scrollView: {
    flex: 1,
  },
});

