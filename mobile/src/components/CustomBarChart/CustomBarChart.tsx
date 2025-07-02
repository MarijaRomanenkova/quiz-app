/**
 * @fileoverview Custom Bar Chart component for the mobile application
 * 
 * This component provides a responsive, interactive bar chart interface
 * for displaying time-based data with customizable styling and tooltips.
 * It's specifically designed for showing study minutes and other time
 * metrics with intelligent scaling and visual feedback.
 * 
 * Key Features:
 * - Interactive tooltips on bar touch
 * - Responsive sizing based on screen width
 * - Soft cap system (75 minutes) for better visual balance
 * - Automatic bar width calculation
 * - Customizable colors and spacing
 * - Touch feedback and accessibility support
 * 
 * The soft cap system prevents extremely high values from dominating
 * the visual space while still indicating their relative magnitude.
 * Values above 75 minutes are compressed but still visually higher.
 * 
 * @module components/CustomBarChart
 */

// React and core libraries
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';

// Project utilities and services
import { formatTime } from '../../utils/formatUtils';

// Types and interfaces
import { CustomBarChartProps } from '../../types/components.types';

// Theme and styling
import { theme } from '../../theme';

/**
 * Data structure for individual bar items
 * 
 * @interface BarData
 * @property {string} [label] - Optional label for the bar (e.g., day of week)
 * @property {number} value - The numeric value to display (typically minutes)
 * @property {string} [color] - Optional custom color for the bar
 */

/**
 * Props interface for the CustomBarChart component
 * 
 * @interface CustomBarChartProps
 * @property {BarData[]} data - Array of data points to display as bars
 * @property {number} [height] - Custom height for the chart container (auto-calculated if not provided)
 * @property {number} [width=screenWidth - 64] - Custom width for the chart container
 * @property {number} [maxValue] - Maximum value for scaling (auto-calculated from data if not provided)
 * @property {boolean} [showValues=false] - Whether to show value labels (currently not implemented)
 * @property {number} [barSpacing=2] - Spacing between bars in pixels
 * @property {number} [barWidth] - Custom width for bars (auto-calculated if not provided)
 * @property {string} [testID] - Optional testID for testing
 */

// Constants
const screenWidth = Dimensions.get('window').width;
const SOFT_CAP = 75; // Soft cap at 75 minutes for visual purposes
const MIN_BAR_HEIGHT = 4; // Minimum height for visibility
const MAX_BAR_WIDTH = 120; // Maximum bar width to prevent huge bars with few data points
const CONTAINER_PADDING = 16; // Small padding on each side
const HEIGHT_RATIO = 0.6; // 60% of width for auto height calculation
const MAX_AUTO_HEIGHT = 200; // Maximum auto-calculated height

// Utility functions
/**
 * Calculates the height of a bar based on its value and the soft cap system
 * 
 * The soft cap system provides better visual balance by:
 * - Displaying values up to 75 minutes proportionally
 * - Compressing values above 75 minutes to prevent visual domination
 * - Still indicating that compressed values are higher than the cap
 * 
 * @param {number} value - The numeric value to calculate height for (typically minutes)
 * @param {number} visualMax - The maximum value for scaling (capped at SOFT_CAP)
 * @param {number} containerHeight - The height of the chart container in pixels
 * @returns {number} The calculated height in pixels
 * 
 * @example
 * // For a value of 30 minutes with visualMax of 75 and containerHeight of 200
 * // Returns: (30 / 75) * (200 - 20) = 72 pixels
 * 
 * @example
 * // For a value of 120 minutes with visualMax of 75 and containerHeight of 200
 * // Returns: (75 + (120 - 75) * 0.3) / 75 * (200 - 20) = 88.8 pixels
 */
const getBarHeight = (value: number, visualMax: number, containerHeight: number): number => {
  if (value <= SOFT_CAP) {
    return (value / visualMax) * (containerHeight - 20);
  } else {
    // For values above soft cap, compress but still show they're higher
    const compressedValue = SOFT_CAP + (value - SOFT_CAP) * 0.3;
    return (compressedValue / visualMax) * (containerHeight - 20);
  }
};

/**
 * Custom Bar Chart component with interactive tooltips and responsive design
 * 
 * Provides a responsive bar chart that automatically scales to fit the
 * available space and handles touch interactions to show detailed tooltips.
 * The chart uses a soft cap system to prevent extremely high values from
 * dominating the visual space while still indicating their relative magnitude.
 * 
 * Features:
 * - Touch interactions to show/hide tooltips
 * - Responsive sizing based on screen width
 * - Automatic bar width calculation
 * - Soft cap system for visual balance
 * - Customizable colors and spacing
 * - Accessibility support with testID
 * 
 * @param {CustomBarChartProps} props - The chart props
 * @param {BarData[]} props.data - Array of data points to display as bars
 * @param {number} [props.height] - Custom height for the chart container
 * @param {number} [props.width=screenWidth - 64] - Custom width for the chart container
 * @param {number} [props.maxValue] - Maximum value for scaling
 * @param {boolean} [props.showValues=false] - Whether to show value labels
 * @param {number} [props.barSpacing=2] - Spacing between bars in pixels
 * @param {number} [props.barWidth] - Custom width for bars
 * @param {string} [props.testID] - Optional testID for testing
 * @returns {JSX.Element} An interactive bar chart with tooltips
 * 
 * @example
 * ```tsx
 * // Basic usage with study minutes data
 * <CustomBarChart
 *   data={[
 *     { value: 30, label: 'Mon' },
 *     { value: 45, label: 'Tue' },
 *     { value: 60, label: 'Wed' },
 *     { value: 90, label: 'Thu' },
 *     { value: 25, label: 'Fri' }
 *   ]}
 * />
 * ```
 * 
 * @example
 * ```tsx
 * // Custom styling with specific dimensions
 * <CustomBarChart
 *   data={weeklyData}
 *   width={300}
 *   height={200}
 *   barSpacing={4}
 *   barWidth={20}
 *   testID="weekly-study-chart"
 * />
 * ```
 * 
 * @example
 * ```tsx
 * // With custom colors for specific bars
 * <CustomBarChart
 *   data={[
 *     { value: 30, color: '#4CAF50' },
 *     { value: 45, color: '#2196F3' },
 *     { value: 60, color: '#FF9800' }
 *   ]}
 * />
 * ```
 */
export const CustomBarChart: React.FC<CustomBarChartProps> = ({
  data,
  height,
  width = screenWidth - 64,
  maxValue,
  barSpacing = 2,
  barWidth,
  testID,
}) => {
  // State for tooltip interaction
  const [selectedBar, setSelectedBar] = useState<number | null>(null);
  
  // Derived values for responsive design
  const actualMax = maxValue || Math.max(...data.map(item => item.value), 1);
  const visualMax = Math.min(actualMax, SOFT_CAP);
  const containerHeight = height || Math.min(width * HEIGHT_RATIO, MAX_AUTO_HEIGHT);
  
  // Calculate responsive bar width if not provided
  const availableWidth = width - (CONTAINER_PADDING * 2);
  const calculatedBarWidth = barWidth || Math.min(
    Math.max((availableWidth - (data.length - 1) * barSpacing) / data.length, 8),
    MAX_BAR_WIDTH
  );
  
  // Calculate total width needed for bars
  const totalBarWidth = data.length * calculatedBarWidth + (data.length - 1) * barSpacing;
  
  return (
    <View style={[styles.container, { width, height: containerHeight }]} testID={testID}>
      <View style={[styles.barsContainer, { width: totalBarWidth }]}>
        {data.map((item, index) => {
          const barHeight = Math.max(getBarHeight(item.value, visualMax, containerHeight), MIN_BAR_HEIGHT);
          const barColor = item.color || theme.colors.primaryContainer;
          const isSelected = selectedBar === index;
          
          return (
            <TouchableOpacity
              key={index}
              style={styles.barWrapper}
              onPress={() => setSelectedBar(isSelected ? null : index)}
              activeOpacity={0.7}
              testID={`bar-${index}`}
            >
              {/* Interactive tooltip */}
              {isSelected && (
                <View style={styles.tooltip}>
                  <Text style={styles.tooltipText}>{formatTime(item.value)}</Text>
                </View>
              )}
              
              {/* Bar visualization */}
              <View
                style={[
                  styles.bar,
                  {
                    height: barHeight,
                    width: calculatedBarWidth,
                    backgroundColor: barColor,
                  },
                ]}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  bar: {
    borderRadius: 4,
  },
  barWrapper: {
    alignItems: 'center',
    marginHorizontal: 1,
  },
  barsContainer: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    height: '100%',
    justifyContent: 'center',
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tooltip: {
    backgroundColor: theme.colors.surface + 'CC', // 80% opacity
    borderRadius: 4,
    left: 0,
    padding: 4,
    position: 'absolute',
    right: 0,
    top: -30,
  },
  tooltipText: {
    color: theme.colors.onSurface,
    fontSize: 12,
  },
}); 
