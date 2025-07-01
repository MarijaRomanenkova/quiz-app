/**
 * @fileoverview Level Progress component for the mobile application
 * 
 * This component displays user progress through a level with a circular
 * progress indicator. It shows the current level, completion percentage,
 * and provides a visual representation of progress using an SVG circle.
 * 
 * The component uses a circular progress bar with a soft shadow and
 * displays level information in the center of the circle.
 * 
 * @module components/Results/LevelProgress
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import Svg, { Circle as SvgCircle } from 'react-native-svg';
import { theme } from '../../theme';
import { createTextStyles, createShadowStyles } from '../../utils/themeUtils';
import { LevelProgressProps } from '../../types/components.types';

/**
 * Level Progress component with circular progress indicator
 * 
 * Displays user progress through a level using a circular progress bar
 * with level information displayed in the center. The progress circle
 * shows completion percentage with a visual indicator.
 * 
 * @param {LevelProgressProps} props - The level progress props
 * @param {string} props.level - The current level name
 * @param {number} props.completedTopics - Number of topics completed
 * @param {number} props.totalTopics - Total number of topics
 * @param {number} props.percentage - Completion percentage (0-100)
 * @returns {JSX.Element} A circular progress indicator with level information
 * 
 * @example
 * ```tsx
 * <LevelProgress
 *   level="Beginner"
 *   completedTopics={3}
 *   totalTopics={5}
 *   percentage={60}
 * />
 * ```
 * 
 * @example
 * ```tsx
 * <LevelProgress
 *   level="Advanced"
 *   completedTopics={8}
 *   totalTopics={10}
 *   percentage={80}
 * />
 * ```
 */
export const LevelProgress: React.FC<LevelProgressProps> = ({ 
  level, 
  percentage 
}) => {
  const radius = 78;
  const circumference = 2 * Math.PI * radius;
  const progress = percentage / 100;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <View style={styles.container}>
      <Svg width={radius * 2} height={radius * 2}>
        {/* Background circle */}
        <SvgCircle
          cx={radius}
          cy={radius}
          r={radius - 6}
          stroke="#E6E0F8"
          strokeWidth={12}
          fill="none"
        />
        {/* Progress circle */}
        <SvgCircle
          cx={radius}
          cy={radius}
          r={radius - 6}
          stroke="#583FB0"
          strokeWidth={12}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90, ${radius}, ${radius})`}
        />
        {/* White center circle */}
        <SvgCircle
          cx={radius}
          cy={radius}
          r={radius - 12}
          fill="white"
        />
      </Svg>
      <View style={styles.levelContainer}>
        <Text style={styles.levelLabel}>Level</Text>
        <Text style={styles.percentageText}>{percentage}%</Text>
        <Text style={styles.levelText}>{level}</Text>
      </View>
    </View>
  );
};

// Create utility styles
const levelStyles = createTextStyles('large', 'regular', theme.colors.outline);
const percentageStyles = createTextStyles('large', 'bold', theme.colors.text);
const shadowStyles = createShadowStyles('small');

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderRadius: 90,
    justifyContent: 'center',
    ...shadowStyles.shadow,
  },
  levelContainer: {
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center',
    position: 'absolute',
    width: '100%',
    paddingHorizontal: 8,
  },
  levelLabel: {
    ...levelStyles.text,
    marginBottom: 2,
    textAlign: 'center',
  },
  levelText: {
    ...levelStyles.text,
    textAlign: 'center',
  },
  percentageText: {
    ...percentageStyles.text,
    marginBottom: 4,
    textAlign: 'center',
  },
}); 
