import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { theme } from '../../theme';

interface BarData {
  label?: string;
  value: number;
  color?: string;
}

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
  const barsHeight = containerHeight / 2; // Bottom half for bars
  
  // Calculate responsive bar width if not provided
  const padding = 16; // Small padding on each side
  const availableWidth = width - (padding * 2);
  const calculatedBarWidth = barWidth || Math.max((availableWidth - (data.length - 1) * barSpacing) / data.length, 8);
  
  // Calculate total width needed for bars
  const totalBarWidth = data.length * calculatedBarWidth + (data.length - 1) * barSpacing;
  
  // Function to calculate bar height with soft cap
  const getBarHeight = (value: number) => {
    if (value <= softCap) {
      return (value / visualMax) * (barsHeight - 20);
    } else {
      // For values above soft cap, compress but still show they're higher
      const compressedValue = softCap + (value - softCap) * 0.3;
      return (compressedValue / visualMax) * (barsHeight - 20);
    }
  };
  
  // Format time for tooltip
  const formatTime = (minutes: number): string => {
    if (minutes < 60) return `${Math.round(minutes)} min`;
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}min`;
  };
  
  return (
    <View style={[styles.container, { width, height: containerHeight }]}>
      {/* Top half - Title/Subtitle area */}
      <View style={[styles.titleArea, { height: containerHeight / 2 }]}>
        {/* This area is reserved for title and subtitle */}
      </View>
      
      {/* Bottom half - Bars */}
      <View style={[styles.barsArea, { height: containerHeight / 2 }]}>
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
  titleArea: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  barsArea: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
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
