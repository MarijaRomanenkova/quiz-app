/**
 * @fileoverview Bottom Tab Navigation for Main Application Screens
 * 
 * This module provides the bottom tab navigation structure for the main
 * application screens. It creates a tab-based navigation with three primary
 * sections: Dashboard (Home), Progress, and Profile, each serving as a
 * main navigation hub for different app functionalities.
 * 
 * The tab navigator uses Material Community Icons for visual consistency
 * and applies comprehensive theming that matches the application's design
 * system. It provides a seamless navigation experience for authenticated
 * users with custom styling and accessibility features.
 * 
 * Key Features:
 * - Three main tabs with intuitive icons and labels
 * - Custom tab bar styling with shadows and borders
 * - Theme-based color scheme for active/inactive states
 * - Header-less screens for custom UI implementation
 * - Consistent height and padding across all tabs
 * - Accessibility support with proper icon sizing
 * 
 * @module navigation/TabNavigator
 */

// React and core libraries
import React from 'react';

// Third-party libraries
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Project components
import { HomeScreen } from '../screens/Home';
import { ProfileScreen } from '../screens/Profile';
import { ProgressScreen } from '../screens/Progress';

// Theme and styling
import { theme } from '../theme';

const Tab = createBottomTabNavigator();

/**
 * Props interface for tab bar icon components
 * 
 * This interface defines the props passed to tab bar icon components
 * by React Navigation. The color and size are automatically managed
 * by the navigation system based on the tab's active state.
 * 
 * @interface TabBarIconProps
 * @property {string} color - The color of the icon (active or inactive state)
 * @property {number} size - The size of the icon in pixels
 * 
 * @example
 * ```tsx
 * const TabIcon = ({ color, size }: TabBarIconProps) => (
 *   <MaterialCommunityIcons name="home" size={size} color={color} />
 * );
 * ```
 */
type TabBarIconProps = {
  color: string;
  size: number;
};

/**
 * Bottom Tab Navigator Component
 * 
 * Provides the main navigation structure for authenticated users with
 * three primary tabs that serve as navigation hubs for different app
 * functionalities. Each tab has a custom icon and consistent styling
 * that matches the application theme and provides an intuitive user
 * experience.
 * 
 * The navigator automatically handles tab switching, state management,
 * and provides visual feedback for the active tab. It's designed to
 * work seamlessly with the main app navigation stack and authentication
 * system.
 * 
 * Features:
 * - Three main tabs with Material Community Icons
 * - Custom tab bar styling with shadows and borders
 * - Theme-based color scheme for active/inactive states
 * - Header-less screens for custom UI implementation
 * - Consistent height and padding across all tabs
 * - Accessibility support with proper icon sizing
 * - Integration with main app navigation stack
 * 
 * @returns {JSX.Element} The bottom tab navigator with configured screens and styling
 * 
 * @example
 * ```tsx
 * // Basic usage in AppNavigator
 * <Stack.Screen name="Home" component={TabNavigator} />
 * ```
 * 
 * @example
 * ```tsx
 * // Navigate between tabs programmatically
 * const navigation = useNavigation();
 * 
 * // Navigate to different tabs
 * navigation.navigate('Dashboard');
 * navigation.navigate('Progress');
 * navigation.navigate('Profile');
 * ```
 * 
 * @example
 * ```tsx
 * // Access current tab route information
 * const route = useRoute();
 * const currentTab = route.name; // 'Dashboard' | 'Progress' | 'Profile'
 * 
 * // Check if specific tab is active
 * const isDashboardActive = route.name === 'Dashboard';
 * ```
 * 
 * @example
 * ```tsx
 * // Custom tab bar styling (if needed)
 * <Tab.Navigator
 *   screenOptions={{
 *     tabBarStyle: {
 *       height: 80,
 *       backgroundColor: theme.colors.surface,
 *       borderTopWidth: 1,
 *       borderTopColor: theme.colors.outline,
 *     }
 *   }}
 * >
 *   Tab screens
 * </Tab.Navigator>
 * ```
 */
export const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        // Active tab color (when tab is selected)
        tabBarActiveTintColor: theme.colors.primary,
        // Inactive tab color (when tab is not selected)
        tabBarInactiveTintColor: theme.colors.outline,
        // Custom tab bar styling
        tabBarStyle: {
          height: 80,
          paddingBottom: 16,
          paddingTop: 16,
          backgroundColor: theme.colors.surface,
          borderTopWidth: 1,
          borderTopColor: theme.colors.outline,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        // Hide tab labels (using only icons)
        tabBarShowLabel: false,
        // Hide headers (using custom UI)
        headerShown: false,
      }}
    >
      {/* Dashboard Tab - Main home screen */}
      <Tab.Screen
        name="Dashboard"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }: TabBarIconProps) => (
            <MaterialCommunityIcons name="home" size={32} color={color} />
          ),
        }}
      />
      
      {/* Progress Tab - Learning progress and statistics */}
      <Tab.Screen
        name="Progress"
        component={ProgressScreen}
        options={{
          tabBarIcon: ({ color }: TabBarIconProps) => (
            <MaterialCommunityIcons name="chart-line" size={32} color={color} />
          ),
        }}
      />
      
      {/* Profile Tab - User profile and settings */}
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color }: TabBarIconProps) => (
            <MaterialCommunityIcons name="account" size={32} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}; 
