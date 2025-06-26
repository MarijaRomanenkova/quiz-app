import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Surface, IconButton, Switch } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../types/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { setUser, updateUserPreferences } from '../../store/userSlice';
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
  const user = useSelector((state: RootState) => state.auth.user);
  const [studyPaceId, setStudyPaceId] = useState(1);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [shareDevices, setShareDevices] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setStudyPaceId(user.studyPaceId);
      setMarketingEmails(user.marketingEmails);
      setShareDevices(user.shareDevices);
      setAgreedToTerms(user.agreedToTerms);
    }
  }, [user]);

  const handleStudyPaceChange = (paceId: number) => {
    setStudyPaceId(paceId);
  };

  const handleMarketingEmailsChange = (value: boolean) => {
    setMarketingEmails(value);
  };

  const handleShareDevicesChange = (value: boolean) => {
    setShareDevices(value);
  };

  const handleTermsChange = (value: boolean) => {
    if (value === false) {
      setShowTermsModal(true);
    } else {
      setAgreedToTerms(true);
    }
  };

  const handleTermsModalCancel = () => {
    setShowTermsModal(false);
  };

  const handleTermsModalDelete = async () => {
    try {
      const { token } = useSelector((state: RootState) => state.auth);
      
      if (token) {
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
    if (!user) return;

    setIsSaving(true);
    try {
      console.log('Saving profile with data:', {
        studyPaceId,
        marketingEmails,
        shareDevices,
      });

      const { token } = useSelector((state: RootState) => state.auth);
      if (!token) {
        throw new Error('No authentication token available');
      }

      const response = await updateUserProfileAPI(token, {
        studyPaceId,
        marketingEmails,
        shareDevices,
      });

      console.log('Profile update response:', response);

      dispatch(
        updateUserPreferences({
      studyPaceId,
      marketingEmails,
      shareDevices,
        })
      );

      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const hasChanges = () => {
    if (!user) return false;
    return (
      studyPaceId !== user.studyPaceId ||
      marketingEmails !== user.marketingEmails ||
      shareDevices !== user.shareDevices
    );
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>User not found</Text>
      </View>
    );
  }

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
        </View>

        {/* Save Button */}
        <Button
          mode="contained"
          onPress={handleSave}
          variant="success"
          disabled={!hasChanges() || isSaving}
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
  errorText: {
    fontSize: 16,
    color: theme.colors.error,
    textAlign: 'center',
    marginTop: 50,
  },
});
