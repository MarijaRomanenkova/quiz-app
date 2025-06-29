import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { Card } from 'react-native-paper';
import { theme } from '../../theme';
import { CustomBarChart } from '../../components/CustomBarChart';
import { LevelProgress } from '../../components/Results/LevelProgress';
import { Button } from '../../components/Button/Button';
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
import { RootState } from '../../store';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const chartWidth = Math.min(screenWidth / 2 - 30, 180); // Responsive width with max of 180px
const chartHeight = chartWidth; // Square charts

/**
 * Statistics screen displaying user's progress and study habits
 */
export const ProgressScreen = () => {
  const navigation = useNavigation();
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

  const handleOkPress = () => {
    navigation.navigate('Home' as never);
  };

  return (
    <View style={styles.container}>
      <View style={styles.screenTitle}>
        <Text style={styles.screenTitle}>Progress</Text>
      </View>
      
      {/* Main content area with flex */}
      <View style={styles.mainContent}>
        {/* Charts Row */}
        <View style={styles.chartsRow}>
          {/* Current Week Chart */}
          <Card style={[styles.chartCard, { width: chartWidth, height: chartHeight }]}>
            <Card.Content style={styles.chartCardContent}>
              {/* Title/Subtitle area */}
              <View style={styles.chartTitleArea}>
                <Text style={styles.chartTitle} numberOfLines={1} ellipsizeMode="tail">This week</Text>
                <Text style={styles.chartSubtitle} numberOfLines={1} ellipsizeMode="tail">{formatTime(currentWeekTotal)}</Text>
                <Text style={styles.chartSubtext} numberOfLines={1} ellipsizeMode="tail">{formatGoalPercentage(weeklyGoalProgress.percentage)}</Text>
              </View>
              
              {/* Bars area */}
              <View style={styles.chartBarsArea}>
                <CustomBarChart
                  data={currentWeekData.map(item => ({
                    value: item.minutes
                  }))}
                  width={chartWidth}
                  height={chartHeight / 2}
                />
              </View>
            </Card.Content>
          </Card>

          {/* Last 5 Weeks Chart */}
          <View style={styles.staggeredChart}>
            <Card style={[styles.chartCard, { width: chartWidth, height: chartHeight }]}>
              <Card.Content style={styles.chartCardContent}>
                {/* Title/Subtitle area */}
                <View style={styles.chartTitleArea}>
                  <Text style={styles.chartTitle} numberOfLines={1} ellipsizeMode="tail">This month</Text>
                  <Text style={styles.chartSubtitle} numberOfLines={1} ellipsizeMode="tail">{formatTime(currentMonthTotal)}</Text>
                  <Text style={styles.chartSubtext} numberOfLines={1} ellipsizeMode="tail">{formatGoalPercentage(monthlyGoalProgress.percentage)}</Text>
                </View>
                
                {/* Bars area */}
                <View style={styles.chartBarsArea}>
                  <CustomBarChart
                    data={lastFiveWeeksData.map(item => ({
                      value: item.minutes,
                      label: item.week
                    }))}
                    width={chartWidth}
                    height={chartHeight / 2}
                  />
                </View>
              </Card.Content>
            </Card>
          </View>
        </View>

        {/* Level Progress Section */}
        <View style={styles.levelSection}>
          {screenHeight >= 400 ? (
            <LevelProgress
              level={levelProgress.level}
              completedTopics={levelProgress.completedTopics}
              totalTopics={levelProgress.totalTopics}
              percentage={levelProgress.percentage}
            />
          ) : null}
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
      </View>

      {/* OK Button Section - Always at bottom */}
      <View style={styles.buttonSection}>
        <Button 
          onPress={handleOkPress} 
          variant="primary"
          style={styles.wideButton}
        >
          OK
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.secondaryContainer,
    padding: 24,
  },
  screenTitle: {
    fontFamily: 'Baloo2-SemiBold',
    fontSize: 32,
    marginBottom: 2,
    textAlign: 'center',
  },
  mainContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  chartsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: 20,
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  staggeredChart: {
    marginTop: ((Dimensions.get('window').width / 3)) / 3,
  },
  chartCard: {
    backgroundColor: theme.colors.surface,
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
  chartCardContent: {
    flex: 1,
  },
  chartTitleArea: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    height: '50%',
  },
  chartBarsArea: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '50%',
  },
  chartTitle: {
    fontSize: 14,
    fontFamily: 'OpenSans-Regular',
    color: theme.colors.outline,
    marginBottom: 4,
  },
  chartSubtitle: {
    fontSize: 28,
    fontFamily: 'Baloo2-SemiBold',
    color: theme.colors.text,
    marginBottom: 4,
  },
  chartSubtext: {
    fontSize: 14,
    fontFamily: 'OpenSans-Regular',
    color: theme.colors.outline,
  },
  levelSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  categorySection: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingVertical: 10,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  categoryName: {
    fontFamily: 'Baloo2-SemiBold',
    fontSize: 24,
  },
  categoryPercentage: {
    fontFamily: 'Baloo2-SemiBold',
    fontSize: 24,
  },
  buttonSection: {
    marginTop: 16,
    marginBottom: 16,
  },
  wideButton: {
    width: '100%',
  },
}); 
