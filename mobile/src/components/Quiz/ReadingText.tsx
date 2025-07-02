/**
 * @fileoverview Reading Text component for the mobile application
 * 
 * This component displays reading comprehension text in a full-screen format
 * with proper typography and scrolling capabilities. It's designed for
 * quiz questions that require users to read a passage before answering
 * comprehension questions.
 * 
 * The component provides a clean, readable interface with:
 * - Full-screen display for optimal reading experience
 * - Scrollable content for long texts
 * - Proper typography hierarchy with title and body text
 * - Consistent styling with the app theme
 * 
 * @module components/Quiz/ReadingText
 */

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

/**
 * Reading Text component for comprehension questions
 * 
 * Displays reading comprehension text in a full-screen format with
 * proper typography and scrolling capabilities. The component is
 * designed to provide an optimal reading experience for users
 * before they answer comprehension questions.
 * 
 * @param {ReadingTextProps} props - The reading text props
 * @param {Object} props.text - The reading text content
 * @param {string} props.text.title - The title of the reading text
 * @param {string} props.text.text - The main text content to display
 * @returns {JSX.Element} A full-screen reading text display with scrolling
 * 
 * @example
 * ```tsx
 * <ReadingText
 *   text={{
 *     title: "The History of Technology",
 *     text: "In the early days of computing..."
 *   }}
 * />
 * ```
 * 
 * @example
 * ```tsx
 * <ReadingText text={readingPassage} />
 * ```
 */
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

