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

/**
 * Props interface for the LevelProgress component
 * 
 * @interface LevelProgressProps
 * @property {string} level - The current level name (e.g., "Beginner", "Intermediate")
 * @property {number} completedTopics - Number of topics completed in the current level
 * @property {number} totalTopics - Total number of topics in the current level
 * @property {number} percentage - Completion percentage (0-100)
 */
interface LevelProgressProps {
  level: string;
  completedTopics: number;
  totalTopics: number;
  percentage: number;
}

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
  completedTopics, 
  totalTopics, 
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

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 90,
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 4,
    elevation: 4,
  },
  levelContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  levelLabel: {
    fontSize: 18,
    fontFamily: 'Baloo2-Regular',
    color: theme.colors.outline,
    marginBottom: -4,
  },
  percentageText: {
    fontSize: 40,
    fontFamily: 'Baloo2-Bold',
    color: theme.colors.text,
    marginBottom: -2,
  },
  levelText: {
    fontSize: 18,
    fontFamily: 'Baloo2-Regular',
    color: theme.colors.outline,
  },
}); 
