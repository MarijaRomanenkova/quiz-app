import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { Card } from 'react-native-paper';
import { theme, fonts, spacing, layout } from '../../theme';
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
import { createLayoutStyles, createTextStyles} from '../../utils/themeUtils';
import { formatTime, formatGoalPercentage } from '../../utils/formatUtils';

// Constants
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const chartWidth = Math.min(screenWidth / 2 - 30, 180); // Responsive width with max of 180px
const chartHeight = chartWidth; // Square charts



/**
 * Statistics screen displaying user's progress and study habits
 */
export const ProgressScreen = () => {
  // Hooks
  const currentWeekData = useSelector(selectCurrentWeekData);
  const lastFiveWeeksData = useSelector(selectLastFiveWeeksData);
  const currentMonthTotal = useSelector(selectCurrentMonthTotal);
  const currentWeekTotal = useSelector(selectCurrentWeekTotal);
  const levelProgress = useSelector(selectLevelProgress);
  const weeklyGoalProgress = useSelector(selectWeeklyGoalProgress);
  const monthlyGoalProgress = useSelector(selectMonthlyGoalProgress);
  const categoryProgress = useSelector(selectAllCategoryProgress);

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
    </View>
  );
};

// Styles
const layoutStyles = createLayoutStyles();
const titleStyles = createTextStyles('xlarge', 'semiBold', theme.colors.text);

const styles = StyleSheet.create({
  container: {
    ...layoutStyles.container,
    backgroundColor: theme.colors.secondaryContainer,
    padding: spacing.lg,
  },
  screenTitle: {
    ...titleStyles.text,
    marginBottom: spacing.xs,
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
    gap: spacing.lg,
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  staggeredChart: {
    marginTop: ((Dimensions.get('window').width / 3)) / 3,
  },
  chartCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: layout.borderRadius.medium,
    ...layout.shadow.large,
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
    fontSize: fonts.sizes.small,
    fontFamily: fonts.weights.regular,
    color: theme.colors.outline,
    marginBottom: spacing.xs,
  },
  chartSubtitle: {
    fontSize: fonts.sizes.medium,
    fontFamily: fonts.weights.semiBold,
    color: theme.colors.text,
    marginBottom: spacing.xs,
  },
  chartSubtext: {
    fontSize: fonts.sizes.small,
    fontFamily: fonts.weights.regular,
    color: theme.colors.outline,
  },
  levelSection: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  categorySection: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  categoryName: {
    fontFamily: fonts.weights.semiBold,
    fontSize: fonts.sizes.large,
  },
  categoryPercentage: {
    fontFamily: fonts.weights.semiBold,
    fontSize: fonts.sizes.large,
  },
  buttonSection: {
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  wideButton: {
    width: '100%',
  },
  categoryTitle: {
    color: theme.colors.surface,
    fontSize: fonts.sizes.medium,
    fontFamily: fonts.weights.regular,
    marginBottom: spacing.sm,
  },
  categoryProgress: {
    color: theme.colors.surface,
    fontSize: fonts.sizes.medium,
    fontFamily: fonts.weights.regular,
  },
}); 
