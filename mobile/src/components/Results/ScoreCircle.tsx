import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import Svg, { Circle } from 'react-native-svg';
import { theme } from '../../theme';

interface ScoreCircleProps {
  score: number;
  total: number;
}

export const ScoreCircle: React.FC<ScoreCircleProps> = ({ score, total }) => {
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const progress = score / total;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <View style={styles.container}>
      <Svg width={radius * 2} height={radius * 2}>
        {/* Background circle */}
        <Circle
          cx={radius}
          cy={radius}
          r={radius - 8}
          stroke="#E6E0F8"
          strokeWidth={16}
          fill="none"
        />
        {/* Progress circle */}
        <Circle
          cx={radius}
          cy={radius}
          r={radius - 8}
          stroke="#583FB0"
          strokeWidth={16}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90, ${radius}, ${radius})`}
        />
        {/* White center circle */}
        <Circle
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
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  scoreLabel: {
    fontSize: 18,
    color: theme.colors.onSurface,
    marginBottom: 8,
  },
  scoreText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
}); 
