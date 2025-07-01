/**
 * @fileoverview Bottom tab navigation for the main application
 * 
 * This module provides the bottom tab navigation structure for the main
 * application screens. It creates a tab-based navigation with three main
 * sections: Dashboard (Home), Progress, and Profile.
 * 
 * The tab navigator uses Material Community Icons for tab icons and
 * applies consistent theming across all tabs with custom styling.
 * 
 * @module navigation/TabNavigator
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { HomeScreen } from '../screens/Home';
import { ProfileScreen } from '../screens/Profile';
import { ProgressScreen } from '../screens/Progress';
import { theme } from '../theme';

const Tab = createBottomTabNavigator();

/**
 * Props interface for tab bar icon components
 * 
 * @interface TabBarIconProps
 * @property {string} color - The color of the icon (active or inactive)
 * @property {number} size - The size of the icon in pixels
 */
type TabBarIconProps = {
  color: string;
  size: number;
};

/**
 * Bottom tab navigator component
 * 
 * Provides the main navigation structure for authenticated users with
 * three primary tabs: Dashboard, Progress, and Profile. Each tab has
 * a custom icon and consistent styling that matches the application theme.
 * 
 * Features:
 * - Three main tabs with Material Community Icons
 * - Custom tab bar styling with shadows and borders
 * - Theme-based color scheme for active/inactive states
 * - Header-less screens for custom UI
 * - Consistent height and padding across all tabs
 * 
 * @returns {JSX.Element} The bottom tab navigator with configured screens
 * 
 * @example
 * ```tsx
 * // Navigate between tabs programmatically
 * navigation.navigate('Dashboard');
 * navigation.navigate('Progress');
 * navigation.navigate('Profile');
 * ```
 * 
 * @example
 * ```tsx
 * // Access current tab route
 * const route = useRoute();
 * const currentTab = route.name; // 'Dashboard' | 'Progress' | 'Profile'
 * ```
 */
export const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.outline,
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
        tabBarShowLabel: false,
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }: TabBarIconProps) => (
            <MaterialCommunityIcons name="home" size={32} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Progress"
        component={ProgressScreen}
        options={{
          tabBarIcon: ({ color }: TabBarIconProps) => (
            <MaterialCommunityIcons name="chart-line" size={32} color={color} />
          ),
        }}
      />
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
