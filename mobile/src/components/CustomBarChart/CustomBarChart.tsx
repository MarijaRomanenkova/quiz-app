/**
 * @fileoverview Custom Bar Chart component for the mobile application
 * 
 * This component provides a responsive, interactive bar chart interface
 * for displaying data with customizable styling and tooltips. It's specifically
 * designed for showing time-based data (like study minutes) with a soft cap
 * for better visual representation of outliers.
 * 
 * The component supports touch interactions to show tooltips, responsive
 * sizing based on screen width, and automatic scaling with a soft cap
 * at 75 minutes for better visual balance.
 * 
 * @module components/CustomBarChart
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { theme } from '../../theme';

/**
 * Data structure for individual bar items
 * 
 * @interface BarData
 * @property {string} [label] - Optional label for the bar (e.g., day of week)
 * @property {number} value - The numeric value to display (typically minutes)
 * @property {string} [color] - Optional custom color for the bar
 */
interface BarData {
  label?: string;
  value: number;
  color?: string;
}

/**
 * Props interface for the CustomBarChart component
 * 
 * @interface CustomBarChartProps
 * @property {BarData[]} data - Array of data points to display as bars
 * @property {number} [height] - Custom height for the chart container
 * @property {number} [width] - Custom width for the chart container (defaults to screen width - 64)
 * @property {number} [maxValue] - Maximum value for scaling (auto-calculated if not provided)
 * @property {boolean} [showValues=false] - Whether to show value labels (currently unused)
 * @property {number} [barSpacing=2] - Spacing between bars in pixels
 * @property {number} [barWidth] - Custom width for bars (auto-calculated if not provided)
 */
interface CustomBarChartProps {
  data: BarData[];
  height?: number;
  width?: number;
  maxValue?: number;
  showValues?: boolean;
  barSpacing?: number;
  barWidth?: number;
}

const screenWidth = Dimensions.get('window').width;

/**
 * Custom Bar Chart component with interactive tooltips
 * 
 * Provides a responsive bar chart that automatically scales to fit the
 * available space and handles touch interactions to show detailed tooltips.
 * The chart uses a soft cap system to prevent extremely high values from
 * dominating the visual space while still indicating their relative magnitude.
 * 
 * @param {CustomBarChartProps} props - The chart props
 * @param {BarData[]} props.data - Array of data points to display as bars
 * @param {number} [props.height] - Custom height for the chart container
 * @param {number} [props.width=screenWidth - 64] - Custom width for the chart container
 * @param {number} [props.maxValue] - Maximum value for scaling
 * @param {boolean} [props.showValues=false] - Whether to show value labels
 * @param {number} [props.barSpacing=2] - Spacing between bars in pixels
 * @param {number} [props.barWidth] - Custom width for bars
 * @returns {JSX.Element} An interactive bar chart with tooltips
 * 
 * @example
 * ```tsx
 * <CustomBarChart
 *   data={[
 *     { value: 30, label: 'Mon' },
 *     { value: 45, label: 'Tue' },
 *     { value: 60, label: 'Wed' }
 *   ]}
 *   width={300}
 *   height={200}
 * />
 * ```
 * 
 * @example
 * ```tsx
 * <CustomBarChart
 *   data={weeklyData}
 *   barSpacing={4}
 *   barWidth={20}
 * />
 * ```
 */
export const CustomBarChart: React.FC<CustomBarChartProps> = ({
  data,
  height,
  width = screenWidth - 64,
  maxValue,
  showValues = false,
  barSpacing = 2,
  barWidth,
}) => {
  const [selectedBar, setSelectedBar] = useState<number | null>(null);
  
  // Calculate max value if not provided
  const actualMax = maxValue || Math.max(...data.map(item => item.value), 1);
  
  // Soft cap at 75 minutes for visual purposes
  const softCap = 75;
  const visualMax = Math.min(actualMax, softCap);
  
  // Use provided height or calculate a reasonable height based on width
  const containerHeight = height || Math.min(width * 0.6, 200); // 60% of width, max 200px
  
  // Calculate responsive bar width if not provided
  const padding = 16; // Small padding on each side
  const availableWidth = width - (padding * 2);
  const calculatedBarWidth = barWidth || Math.min(
    Math.max((availableWidth - (data.length - 1) * barSpacing) / data.length, 8),
    120 // Maximum bar width to prevent huge bars with few data points
  );
  
  // Calculate total width needed for bars
  const totalBarWidth = data.length * calculatedBarWidth + (data.length - 1) * barSpacing;
  
  /**
   * Calculates the height of a bar based on its value and the soft cap system
   * 
   * Values up to the soft cap (75 minutes) are displayed proportionally.
   * Values above the soft cap are compressed to prevent visual domination
   * while still indicating they are higher than the cap.
   * 
   * @param {number} value - The numeric value to calculate height for
   * @returns {number} The calculated height in pixels
   */
  const getBarHeight = (value: number) => {
    if (value <= softCap) {
      return (value / visualMax) * (containerHeight - 20);
    } else {
      // For values above soft cap, compress but still show they're higher
      const compressedValue = softCap + (value - softCap) * 0.3;
      return (compressedValue / visualMax) * (containerHeight - 20);
    }
  };
  
  /**
   * Formats time values for display in tooltips
   * 
   * Converts minutes to hours and minutes format for better readability.
   * 
   * @param {number} minutes - The time value in minutes
   * @returns {string} Formatted time string (e.g., "1h 30min" or "45 min")
   */
  const formatTime = (minutes: number): string => {
    if (minutes < 60) return `${Math.round(minutes)} min`;
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}min`;
  };
  
  return (
    <View style={[styles.container, { width, height: containerHeight }]}>
      <View style={[styles.barsContainer, { width: totalBarWidth }]}>
        {data.map((item, index) => {
          const barHeight = Math.max(getBarHeight(item.value), 4); // Minimum height for visibility
          const barColor = item.color || theme.colors.primaryContainer;
          const isSelected = selectedBar === index;
          
          return (
            <TouchableOpacity
              key={index}
              style={styles.barWrapper}
              onPress={() => setSelectedBar(isSelected ? null : index)}
              activeOpacity={0.7}
            >
              {/* Tooltip */}
              {isSelected && (
                <View style={styles.tooltip}>
                  <Text style={styles.tooltipText}>{formatTime(item.value)}</Text>
                </View>
              )}
              
              {/* Bar */}
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

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  barsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    height: '100%',
  },
  barWrapper: {
    alignItems: 'center',
    marginHorizontal: 1,
  },
  bar: {
    borderRadius: 4,
  },
  tooltip: {
    position: 'absolute',
    top: -30,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 4,
    borderRadius: 4,
  },
  tooltipText: {
    color: '#fff',
    fontSize: 12,
  },
}); 
