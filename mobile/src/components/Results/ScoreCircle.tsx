/**
 * @fileoverview Score Circle component for the mobile application
 * 
 * This component displays quiz results using a circular progress indicator
 * that shows the user's score as a fraction and visual progress. It's designed
 * to provide an engaging visual representation of quiz performance.
 * 
 * The component uses an SVG circle to create a progress ring that fills
 * based on the score percentage, with the score displayed in the center.
 * 
 * @module components/Results/ScoreCircle
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import Svg, { Circle as SvgCircle } from 'react-native-svg';
import { ScoreCircleProps } from '../../types/components.types';

/**
 * Score Circle component with circular progress indicator
 * 
 * Displays quiz results using a circular progress bar that visually
 * represents the score as a percentage. The score is shown as a fraction
 * in the center of the circle.
 * 
 * @param {ScoreCircleProps} props - The score circle props
 * @param {number} props.score - The number of correct answers
 * @param {number} props.total - The total number of questions
 * @returns {JSX.Element} A circular score indicator with progress visualization
 * 
 * @example
 * ```tsx
 * <ScoreCircle score={8} total={10} />
 * ```
 * 
 * @example
 * ```tsx
 * <ScoreCircle score={15} total={20} />
 * ```
 */
export const ScoreCircle: React.FC<ScoreCircleProps> = ({ score, total }) => {
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const progress = score / total;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <View style={styles.container}>
      <Svg width={radius * 2} height={radius * 2}>
        {/* Background circle */}
        <SvgCircle
          cx={radius}
          cy={radius}
          r={radius - 8}
          stroke="#E6E0F8"
          strokeWidth={16}
          fill="none"
        />
        {/* Progress circle */}
        <SvgCircle
          cx={radius}
          cy={radius}
          r={radius - 8}
          stroke="#4313E2"
          strokeWidth={16}
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
          r={radius - 16}
          fill="white"
        />
      </Svg>
      <View style={styles.scoreContainer}>
        <Text variant="titleMedium">Your score is</Text>
        <Text variant="displayLarge">{score}/{total}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreContainer: {
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center',
    position: 'absolute',
    width: '100%',
  },
}); 
