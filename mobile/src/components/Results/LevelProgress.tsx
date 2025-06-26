import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import Svg, { Circle as SvgCircle } from 'react-native-svg';
import { theme } from '../../theme';

interface LevelProgressProps {
  level: string;
  completedTopics: number;
  totalTopics: number;
  percentage: number;
}

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
  },
  percentageText: {
    fontSize: 40,
    fontFamily: 'Baloo2-Bold',
    color: theme.colors.text,
  },
  levelText: {
    fontSize: 18,
    fontFamily: 'Baloo2-Regular',
    color: theme.colors.outline,
  },
}); 
