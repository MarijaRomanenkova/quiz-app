import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useSelector } from 'react-redux';
import { Card, Title } from 'react-native-paper';
import { theme } from '../../theme';
import { CustomBarChart } from '../../components/CustomBarChart';
import { LevelProgress } from '../../components/Results/LevelProgress';
import { 
  selectCurrentWeekData,
  selectLastFiveWeeksData,
  selectCurrentMonthTotal,
  selectCurrentWeekTotal,
  selectLevelProgress,
  selectWeeklyGoalProgress,
  selectMonthlyGoalProgress
} from '../../store/statisticsSlice';
import { selectAllCategoryProgress } from '../../store/progressSlice';

const screenWidth = Dimensions.get('window').width;

/**
 * Statistics screen displaying user's progress and study habits
 */
export const ProgressScreen = () => {
  const currentWeekData = useSelector(selectCurrentWeekData);
  const lastFiveWeeksData = useSelector(selectLastFiveWeeksData);
  const currentMonthTotal = useSelector(selectCurrentMonthTotal);
  const currentWeekTotal = useSelector(selectCurrentWeekTotal);
  const levelProgress = useSelector(selectLevelProgress);
  const weeklyGoalProgress = useSelector(selectWeeklyGoalProgress);
  const monthlyGoalProgress = useSelector(selectMonthlyGoalProgress);
  const categoryProgress = useSelector(selectAllCategoryProgress);

  // Format time (minutes to hours and minutes)
  const formatTime = (minutes: number): string => {
    if (minutes < 60) return `${Math.round(minutes)} min`;
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}min`;
  };

  // Format goal percentage
  const formatGoalPercentage = (percentage: number): string => {
    if (percentage > 100) {
      return `+${percentage - 100} % of the target`;
    } else if (percentage < 100) {
      return `-${100 - percentage} % of the target`;
    } else {
      return '100 % of target';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.screenTitle}>
        <Text style={styles.screenTitle}>Progress</Text>
      </View>
      {/* Charts Row */}
      <View style={styles.chartsRow}>
        {/* Current Week Chart */}
        <Card style={[styles.chartCard, { width: screenWidth / 2 - 40, height: screenWidth / 2 - 40 }]}>
          <Card.Content style={styles.cardContent}>
            <View style={styles.titleSection}>
              <View style={styles.chartHeader}>
                <View>
                  <Title style={styles.chartTitle}>This week</Title>
                  <Text style={styles.chartSubtitle}>{formatTime(currentWeekTotal)}</Text>
                  <Text style={styles.chartTitle}>{formatGoalPercentage(weeklyGoalProgress.percentage)}</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.barsSection}>
              <CustomBarChart
                data={currentWeekData.map(item => ({
                  value: item.minutes
                }))}
                width={screenWidth / 2 - 40}
              />
            </View>
          </Card.Content>
        </Card>

        {/* Last 5 Weeks Chart */}
        <Card style={[styles.chartCard, styles.secondChart, { width: screenWidth / 2 - 40, height: screenWidth / 2 - 40 }]}>
          <Card.Content style={styles.cardContent}>
            <View style={styles.titleSection}>
              <View style={styles.chartHeader}>
                <View>
                  <Title style={styles.chartTitle}>This month</Title>
                  <Text style={styles.chartSubtitle}>{formatTime(currentMonthTotal)}</Text>
                  <Text style={styles.chartTitle}>{formatGoalPercentage(monthlyGoalProgress.percentage)}</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.barsSection}>
              <CustomBarChart
                data={lastFiveWeeksData.map(item => ({
                  value: item.minutes,
                  label: item.week
                }))}
                width={screenWidth / 2 - 40}
              />
            </View>
          </Card.Content>
        </Card>
      </View>

      {/* Level Progress Section */}
      <View style={styles.levelSection}>
        <LevelProgress
          level={levelProgress.level}
          completedTopics={levelProgress.completedTopics}
          totalTopics={levelProgress.totalTopics}
          percentage={levelProgress.percentage}
        />
      </View>

      {/* Category Progress Section */}
      <View style={styles.categorySection}>
        {categoryProgress.map((category) => (
          <View key={category.categoryId} style={styles.categoryItem}>
            <Text style={styles.categoryName}>
              {category.categoryId.charAt(0).toUpperCase() + category.categoryId.slice(1)}
            </Text>
            <Text style={styles.categoryPercentage}>{category.percentage}%</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.secondaryContainer,
    padding: 16,
  },
  screenTitle: {
    fontFamily: 'Baloo2-SemiBold',
    fontSize: 32,
    marginBottom: 2,
    textAlign: 'center',
  },
  levelSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  chartsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 20,
    paddingTop: 20,
  },
  chartCard: {
    flex: 1,
    marginHorizontal: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    shadowColor: '#000000',
    shadowOpacity: 0.15,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 50,
    elevation: 8,
  },
  chartTitle: {
    fontFamily: 'BalooBhaina2-Regular',
    fontSize: 16,
    marginBottom: 2,
    color: theme.colors.outline,
  },
  chartSubtitle: {
    fontFamily: 'BalooBhaina2-Regular',
    fontSize: 32,
    color: theme.colors.text,
    marginBottom: 2,
  },  

  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  titleSection: {
    height: '50%',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  barsSection: {
    height: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 32,
  },
  secondChart: {
    marginTop: ((screenWidth / 3)) / 3,
  },
  categorySection: {
    paddingVertical: 20,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  categoryName: {
    fontFamily: 'Baloo2-Bold',
    fontSize: 20,
  },
  categoryPercentage: {
    fontFamily: 'Baloo2-Bold',
    fontSize: 20,
  },
}); 
