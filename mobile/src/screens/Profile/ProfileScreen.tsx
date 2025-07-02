/**
 * @fileoverview Profile Screen component for the mobile application
 * 
 * This component provides a comprehensive user profile management interface
 * where users can view and modify their account settings, study preferences,
 * and privacy options. It handles user preferences, study pace selection,
 * and account deletion with proper confirmation dialogs.
 * 
 * The component features:
 * - User information display (username, email, level)
 * - Study pace selection with visual interface
 * - Privacy and marketing preference toggles
 * - Terms and conditions agreement management
 * - Account deletion with confirmation modal
 * - Profile data synchronization with backend
 * 
 * @module screens/Profile
 */

// React and core libraries
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Surface, Switch } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

// Third-party libraries
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Project utilities and services
import { updateUserPreferences } from '../../store/authSlice';
import { useAuth } from '../../hooks/useAuth';
import { deleteUserAccount } from '../../services/api';
import { handleApiError } from '../../utils/apiUtils';
import { createLayoutStyles, createTextStyles } from '../../utils/themeUtils';

// Project components
import { StudyPaceSelector } from '../../components/StudyPaceSelector/StudyPaceSelector';
import { Button } from '../../components/Button/Button';
import { CustomModal } from '../../components/Modal/CustomModal';
import { BackButton } from '../../components/BackButton';

// Types and interfaces
import type { RootStackParamList } from '../../types/navigation';
import { RootState } from '../../store';

// Theme and styling
import { theme, fonts, spacing } from '../../theme';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Profile'>;

/**
 * Profile Screen component for user account management
 * 
 * Provides a comprehensive interface for users to manage their profile
 * settings, study preferences, and account information. Integrates with
 * the backend to persist changes and handles account deletion with
 * proper confirmation workflows.
 * 
 * Key features:
 * - User information display and editing
 * - Study pace selection with visual interface
 * - Privacy and marketing preference management
 * - Terms and conditions agreement tracking
 * - Account deletion with confirmation modal
 * - Real-time change detection and save functionality
 * - Backend synchronization for all preferences
 * 
 * @returns {JSX.Element} The profile management screen with all user settings
 * 
 * @example
 * ```tsx
 * // Navigation to profile screen
 * navigation.navigate('Profile');
 * ```
 */
export const ProfileScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useDispatch();
  const { logout } = useAuth();
  const user = useSelector((state: RootState) => state.auth.user);
  const { token } = useSelector((state: RootState) => state.auth);
  
  const [showTermsModal, setShowTermsModal] = useState(false);

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>User not found</Text>
      </View>
    );
  }

  /**
   * Handles study pace selection changes
   * 
   * Updates the Redux state when user selects
   * a different pace option.
   * 
   * @param {number} paceId - The selected study pace ID
   */
  const handleStudyPaceChange = (paceId: number) => {
    dispatch(updateUserPreferences({ studyPaceId: paceId }));
  };

  /**
   * Handles marketing emails preference changes
   * 
   * Updates the Redux state for marketing emails toggle.
   * 
   * @param {boolean} value - The new marketing emails preference
   */
  const handleMarketingEmailsChange = (value: boolean) => {
    dispatch(updateUserPreferences({ marketingEmails: value }));
  };

  /**
   * Handles device sharing preference changes
   * 
   * Updates the Redux state for device sharing toggle.
   * 
   * @param {boolean} value - The new device sharing preference
   */
  const handleShareDevicesChange = (value: boolean) => {
    dispatch(updateUserPreferences({ shareDevices: value }));
  };

  /**
   * Handles terms and conditions agreement changes
   * 
   * Shows confirmation modal when user tries to disagree with terms,
   * as this triggers account deletion workflow.
   * 
   * @param {boolean} value - The new terms agreement value
   */
  const handleTermsChange = (value: boolean) => {
    if (value === false) {
      setShowTermsModal(true);
    } else {
      dispatch(updateUserPreferences({ agreedToTerms: true }));
    }
  };

  /**
   * Handles terms modal cancellation
   * 
   * Closes the terms disagreement modal without taking action.
   */
  const handleTermsModalCancel = () => {
    setShowTermsModal(false);
  };

  /**
   * Handles account deletion from terms disagreement
   * 
   * Deletes the user account from the backend and logs out
   * when user confirms disagreement with terms.
   */
  const handleTermsModalDelete = async () => {
    try {
      if (token) {
        await deleteUserAccount(token);
      }
      
      setShowTermsModal(false);
      logout();
    } catch (error) {
      handleApiError(error, 'Failed to delete your account. Please try again.');
    }
  };

  /**
   * Handles navigation to terms screen
   * 
   * Navigates to the terms and conditions screen for user review.
   */
  const handleTermsPress = () => {
    navigation.navigate('Terms');
  };

  /**
   * Handles user logout
   * 
   * Logs out the user and clears authentication state.
   */
  const handleLogout = () => {
    logout();
  };

  return (
    <Surface style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <BackButton variant="dark" onPress={() => navigation.goBack()} />
        <Text style={styles.backText}>Back</Text>
      </View>

      {/* Main Content with Flex Spacing */}
      <View style={styles.mainContent}>
        {/* User Info */}
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user.username}</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email:</Text>
            <Text style={styles.infoValue}>{user.email}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Level:</Text>
            <Text style={styles.infoValue}>{user.levelId}</Text>
          </View>
        </View>

        {/* Study Pace */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Study Pace</Text>
          <View style={styles.studyPaceContainer}>
            <StudyPaceSelector 
              currentPaceId={user.studyPaceId} 
              onPaceChange={handleStudyPaceChange}
            />
          </View>
        </View>

        {/* Toggles */}
        <View style={styles.toggles}>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>
              Agree to{' '}
              <Text 
                style={styles.termsLink}
                onPress={handleTermsPress}
              >
                Terms and Conditions
              </Text>
            </Text>
            <Switch value={user.agreedToTerms} onValueChange={handleTermsChange} testID="terms-switch" />
          </View>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Agree to Marketing Emails</Text>
            <Switch value={user.marketingEmails} onValueChange={handleMarketingEmailsChange} testID="marketing-switch" />
          </View>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Share Among Devices</Text>
            <Switch value={user.shareDevices} onValueChange={handleShareDevicesChange} testID="devices-switch" />
          </View>
        </View>
      </View>

      {/* Buttons Container at Bottom */}
      <View style={styles.buttonsContainer}>
        {/* Delete Account Button */}
        <Button
          mode="contained"
          onPress={() => setShowTermsModal(true)}
          variant="secondary"
          style={styles.deleteButton}
        >
          Delete Account
        </Button>

        {/* Logout Button */}
        <Button
          mode="contained"
          onPress={handleLogout}
          variant="success"
          style={styles.logoutButton}
        >
          Log Out
        </Button>
      </View>

      <CustomModal
        visible={showTermsModal}
        onDismiss={handleTermsModalCancel}
        title="Terms and Conditions Required"
        message="If you disagree with our terms, you will not be able to use this app. Do you wish to read our Terms and Conditions? Do you want to disagree and delete your user profile?"
        primaryButtonText="Cancel"
        onPrimaryButtonPress={handleTermsModalCancel}
        secondaryButtonText="Delete Account"
        onSecondaryButtonPress={handleTermsModalDelete}
      />
    </Surface>
  );
};

const layoutStyles = createLayoutStyles();
const titleStyles = createTextStyles('xlarge', 'bold', theme.colors.surface);
const sectionTitleStyles = createTextStyles('large', 'medium', theme.colors.surface);
const bodyTextStyles = createTextStyles('medium', 'regular', theme.colors.surface);

const styles = StyleSheet.create({
  backText: {
    ...bodyTextStyles.text,
  },
  buttonsContainer: {
    paddingBottom: spacing.md,
  },
  container: {
    ...layoutStyles.container,
    backgroundColor: theme.colors.background,
    padding: spacing.lg,
  },
  deleteButton: {
    marginBottom: spacing.md,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: fonts.sizes.medium,
    marginTop: spacing.xxl,
    textAlign: 'center',
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: spacing.md,
  },
  infoLabel: {
    ...bodyTextStyles.text,
    width: 80,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
    width: '100%',
  },
  infoValue: {
    ...bodyTextStyles.text,
    flex: 1,
  },
  logoutButton: {
    marginBottom: 0,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  section: {
    paddingVertical: spacing.md,
  },
  sectionTitle: {
    ...sectionTitleStyles.text,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  studyPaceContainer: {
    width: '100%',
  },
  termsLink: {
    ...bodyTextStyles.text,
    fontFamily: fonts.weights.bold,
    textDecorationLine: 'underline',
  },
  toggleLabel: {
    ...bodyTextStyles.text,
    flex: 1,
  },
  toggleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  toggles: {
    paddingVertical: spacing.lg,
  },
  userInfo: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  userName: {
    ...titleStyles.text,
    marginBottom: spacing.md,
  },
});
