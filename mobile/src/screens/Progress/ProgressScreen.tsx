import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Card, Title, Paragraph, ProgressBar } from 'react-native-paper';
import { theme } from '../../theme';
import { Category } from '../../types';

/**
 * Statistics screen displaying user's progress and study habits
 */
export const ProgressScreen = () => {
  const user = useSelector((state: RootState) => state.user);
  const quizState = useSelector((state: RootState) => state.quiz);
  const statistics = useSelector((state: RootState) => state.statistics);
  // Mock categories data since there's no categories in the store
  const [categories, setCategories] = useState<Category[]>([]);
  
  // Load sample categories for demo purposes
  useEffect(() => {
    // In a real app, this would come from an API or the Redux store
    setCategories([
      {
        categoryId: '1',
        title: 'Grammar',
        description: 'Basic grammar rules',
        progress: 65
      },
      {
        categoryId: '2',
        title: 'Vocabulary',
        description: 'Essential vocabulary',
        progress: 40
      },
      {
        categoryId: '3',
        title: 'Conversation',
        description: 'Practical conversation',
        progress: 25
      }
    ]);
  }, []);
  
  // Calculate statistics
  const [statsData, setStatsData] = useState({
    totalTimeSpent: 0,
    averageDailyTime: 0,
    daysStudied: 0,
    totalQuestions: 0,
    studyStreak: 0
  });

  useEffect(() => {
    // Calculate total time spent
    const totalTimeSpent = quizState.dailyStats.reduce((acc, day) => acc + day.timeSpent, 0);
    
    // Calculate days studied
    const daysStudied = quizState.dailyStats.length;
    
    // Calculate average daily time
    const averageDailyTime = daysStudied > 0 ? totalTimeSpent / daysStudied : 0;
    
    // Calculate total questions answered
    const totalQuestions = quizState.dailyStats.reduce((acc, day) => acc + day.questionsAnswered, 0);
    
    // Calculate study streak (consecutive days)
    let studyStreak = 0;
    if (daysStudied > 0) {
      // Sort dates in descending order (newest first)
      const sortedDates = [...quizState.dailyStats]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      // Check if the most recent date is today or yesterday
      const mostRecentDate = new Date(sortedDates[0].date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const isRecentEnough = 
        mostRecentDate.getTime() === today.getTime() || 
        mostRecentDate.getTime() === today.getTime() - 86400000; // 1 day in milliseconds
      
      if (isRecentEnough) {
        // Count consecutive days
        studyStreak = 1;
        for (let i = 0; i < sortedDates.length - 1; i++) {
          const currentDate = new Date(sortedDates[i].date);
          const previousDate = new Date(sortedDates[i + 1].date);
          
          // Check if dates are consecutive
          if (currentDate.getTime() - previousDate.getTime() === 86400000) {
            studyStreak++;
          } else {
            break;
          }
        }
      }
    }
    
    setStatsData({
      totalTimeSpent,
      averageDailyTime,
      daysStudied,
      totalQuestions,
      studyStreak
    });
  }, [quizState.dailyStats]);

  // Format time (minutes to hours and minutes)
  const formatTime = (minutes: number): string => {
    if (minutes < 60) return `${Math.round(minutes)} min`;
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}min`;
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Study Summary</Title>
          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <Paragraph style={styles.statLabel}>Total Time</Paragraph>
              <Text style={styles.statValue}>{formatTime(statsData.totalTimeSpent)}</Text>
            </View>
            <View style={styles.statItem}>
              <Paragraph style={styles.statLabel}>Daily Average</Paragraph>
              <Text style={styles.statValue}>{formatTime(statsData.averageDailyTime)}</Text>
            </View>
          </View>
          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <Paragraph style={styles.statLabel}>Days Studied</Paragraph>
              <Text style={styles.statValue}>{statsData.daysStudied}</Text>
            </View>
            <View style={styles.statItem}>
              <Paragraph style={styles.statLabel}>Current Streak</Paragraph>
              <Text style={styles.statValue}>{statsData.studyStreak} days</Text>
            </View>
          </View>
          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <Paragraph style={styles.statLabel}>Questions Answered</Paragraph>
              <Text style={styles.statValue}>{statsData.totalQuestions}</Text>
            </View>
            <View style={styles.statItem}>
              <Paragraph style={styles.statLabel}>Quiz Attempts</Paragraph>
              <Text style={styles.statValue}>{statistics.totalAttempts}</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Category Progress</Title>
          {categories.map((category: Category) => (
            <View key={category.categoryId} style={styles.categoryProgress}>
              <View style={styles.categoryHeader}>
                <Paragraph>{category.title}</Paragraph>
                <Text style={styles.progressPercentage}>{category.progress}%</Text>
              </View>
              <ProgressBar
                progress={category.progress / 100}
                color={theme.colors.primary}
                style={styles.progressBar}
              />
            </View>
          ))}
          {categories.length === 0 && (
            <Paragraph>No categories available</Paragraph>
          )}
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Recent Activity</Title>
          {quizState.dailyStats.slice(0, 5).map((day, index) => (
            <View key={index} style={styles.recentActivity}>
              <Text style={styles.activityDate}>{new Date(day.date).toLocaleDateString()}</Text>
              <Text style={styles.activityDetails}>
                {formatTime(day.timeSpent)} • {day.questionsAnswered} questions
              </Text>
            </View>
          ))}
          {quizState.dailyStats.length === 0 && (
            <Paragraph>No recent activity</Paragraph>
          )}
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  statItem: {
    flex: 1,
  },
  statLabel: {
    color: theme.colors.secondary,
    opacity: 0.7,
    fontSize: 14,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  categoryProgress: {
    marginVertical: 8,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
  },
  progressPercentage: {
    fontWeight: 'bold',
  },
  recentActivity: {
    marginVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.background,
    paddingBottom: 8,
  },
  activityDate: {
    fontWeight: 'bold',
  },
  activityDetails: {
    color: theme.colors.secondary,
    opacity: 0.7,
  }
}); 
