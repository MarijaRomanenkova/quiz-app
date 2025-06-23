import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Surface, IconButton, Switch } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { setUserProfile, updateUserProfile } from '../../store/userSlice';
import { theme } from '../../theme';
import { StudyPaceSelector } from '../../components/StudyPaceSelector/StudyPaceSelector';
import { Button } from '../../components/Button/Button';
import { CustomModal } from '../../components/Modal/CustomModal';
import { useAuth } from '../../hooks/useAuth';
import { updateUserProfile as updateUserProfileAPI, deleteUserAccount } from '../../services/api';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Profile'>;

export const ProfileScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useDispatch();
  const { logout } = useAuth();
  const { 
    name, 
    studyPaceId = 1, 
    agreedToTerms,
    marketingEmails = false,
    shareDevices = false,
    pushNotifications = false
  } = useSelector((state: RootState) => state.user);
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [showTermsModal, setShowTermsModal] = useState(false);

  const handleStudyPaceChange = (paceId: number) => {
    dispatch(updateUserProfile({ studyPaceId: paceId }));
  };

  const handleMarketingEmailsChange = (value: boolean) => {
    dispatch(updateUserProfile({ marketingEmails: value }));
  };

  const handleShareDevicesChange = (value: boolean) => {
    dispatch(updateUserProfile({ shareDevices: value }));
  };

  const handlePushNotificationsChange = (value: boolean) => {
    dispatch(updateUserProfile({ pushNotifications: value }));
  };

  const handleTermsChange = (value: boolean) => {
    if (value === false) {
      setShowTermsModal(true);
    } else {
      // If user is trying to set it to true, update Redux state
      dispatch(updateUserProfile({ agreedToTerms: true }));
    }
  };

  const handleTermsModalCancel = () => {
    setShowTermsModal(false);
  };

  const handleTermsModalDelete = async () => {
    try {
      const { token } = useSelector((state: RootState) => state.auth);
      
      if (token) {
        // Delete account from backend
        await deleteUserAccount(token);
      }
      
      setShowTermsModal(false);
      logout();
    } catch (error) {
      Alert.alert(
        'Delete Failed',
        'Failed to delete your account. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleTermsPress = () => {
    navigation.navigate('Terms');
  };

  const handleSave = async () => {
    try {
      console.log('ProfileScreen: Starting save process...');
      const { token } = useSelector((state: RootState) => state.auth);
      
      console.log('ProfileScreen: Current Redux state:', {
        studyPaceId,
        marketingEmails,
        shareDevices,
        pushNotifications,
        agreedToTerms
      });
      
      if (token) {
        console.log('ProfileScreen: Making API call to update profile...');
        // Save to backend
        const result = await updateUserProfileAPI(token, {
          studyPaceId,
          marketingEmails,
          shareDevices,
          pushNotifications,
        });
        console.log('ProfileScreen: API call successful:', result);
      } else {
        console.log('ProfileScreen: No token available, skipping backend save');
      }

      // Update Redux state
      console.log('ProfileScreen: Updating Redux state...');
      dispatch(setUserProfile({
        name,
        email: user?.email || '',
        level: user?.levelId || '',
        studyPaceId,
        agreedToTerms,
        marketingEmails,
        shareDevices,
        pushNotifications
      }));

      // Show success message
      console.log('ProfileScreen: Showing success alert...');
      Alert.alert(
        'Success',
        'Your settings have been successfully updated!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (error) {
      console.error('ProfileScreen: Save failed:', error);
      Alert.alert(
        'Save Failed',
        'Failed to save your preferences. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleLogout = () => {
    logout();
    // The navigation will be handled by the auth state change
  };

  return (
    <Surface style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <IconButton
            icon="chevron-left"
            iconColor="#FFFFFF"
            size={24}
            onPress={() => navigation.goBack()}
          />
          <Text style={styles.backText}>Back to Learning</Text>
        </View>

        {/* User Info */}
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{name || user?.username}</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email:</Text>
            <Text style={styles.infoValue}>{user?.email}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Level:</Text>
            <Text style={styles.infoValue}>{user?.levelId}</Text>
          </View>
        </View>

        {/* Study Pace */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Study Pace</Text>
          <StudyPaceSelector 
            currentPaceId={studyPaceId} 
            onPaceChange={handleStudyPaceChange}
          />
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
            <Switch value={agreedToTerms} onValueChange={handleTermsChange} />
          </View>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Agree to Marketing Emails</Text>
            <Switch value={marketingEmails} onValueChange={handleMarketingEmailsChange} />
          </View>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Share Among Devices</Text>
            <Switch value={shareDevices} onValueChange={handleShareDevicesChange} />
          </View>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Agree to Push Notifications</Text>
            <Switch value={pushNotifications} onValueChange={handlePushNotificationsChange} />
          </View>
        </View>

        {/* Save Button */}
        <Button
          mode="contained"
          onPress={handleSave}
          variant="success"
        >
          Save
        </Button>

        {/* Logout Button */}
        <Button
          mode="contained"
          onPress={handleLogout}
          variant="secondary"
          style={styles.logoutButton}
        >
          Log Out
        </Button>
      </ScrollView>

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(67, 19, 226, 0.7)',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  backText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Baloo2-Regular',
  },
  userInfo: {
    padding: 24,
    alignItems: 'center',
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 32,
    fontFamily: 'Baloo2-Bold',
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 12,
  },
  infoLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Baloo2-Regular',
    width: 80,
  },
  infoValue: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Baloo2-Regular',
    flex: 1,
  },
  section: {
    padding: 24,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: 'Baloo2-Medium',
    textAlign: 'center',
    marginBottom: 16,
  },
  toggles: {
    padding: 24,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  toggleLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Baloo2-Regular',
    flex: 1,
  },
  termsLink: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Baloo2-Bold',
    textDecorationLine: 'underline',
  },
  logoutButton: {
    marginTop: 16,
    marginBottom: 40  
  },
});
