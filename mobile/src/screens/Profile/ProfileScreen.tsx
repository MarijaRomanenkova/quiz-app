import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Surface, IconButton, Switch, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { setUserProfile } from '../../store/userSlice';
import { theme } from '../../theme';
import { StudyPaceSelector } from '../../components/StudyPaceSelector/StudyPaceSelector';

export const ProfileScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { name, email, level, studyPaceId = 1, agreedToTerms } = useSelector((state: RootState) => state.user);
  
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [shareDevices, setShareDevices] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(false);

  const handleSave = () => {
    dispatch(setUserProfile({
      name,
      email,
      level,
      studyPaceId,
      agreedToTerms,
      marketingEmails,
      shareDevices,
      pushNotifications
    }));
    navigation.goBack();
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
          <Text style={styles.userName}>{name}</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email:</Text>
            <Text style={styles.infoValue}>{email}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Level:</Text>
            <Text style={styles.infoValue}>{level}</Text>
          </View>
        </View>

        {/* Study Pace */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Study Pace</Text>
          <StudyPaceSelector currentPaceId={studyPaceId} />
        </View>

        {/* Toggles */}
        <View style={styles.toggles}>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Agree to Terms and Conditions</Text>
            <Switch value={agreedToTerms} disabled />
          </View>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Agree to Marketing Emails</Text>
            <Switch value={marketingEmails} onValueChange={setMarketingEmails} />
          </View>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Share Among Devices</Text>
            <Switch value={shareDevices} onValueChange={setShareDevices} />
          </View>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Agree to Push Notifications</Text>
            <Switch value={pushNotifications} onValueChange={setPushNotifications} />
          </View>
        </View>

        {/* Save Button */}
        <Button
          mode="contained"
          onPress={handleSave}
          style={styles.saveButton}
          textColor="#000000"
          buttonColor="#8BF224"
        >
          Save
        </Button>
      </ScrollView>
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
    fontFamily: 'BalooBhaina2-Regular',
  },
  userInfo: {
    padding: 24,
    alignItems: 'center',
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 32,
    fontFamily: 'BalooBhaina2-Bold',
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
    fontFamily: 'BalooBhaina2-Regular',
    width: 80,
  },
  infoValue: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'BalooBhaina2-Regular',
    flex: 1,
  },
  section: {
    padding: 24,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: 'BalooBhaina2-Medium',
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
    fontFamily: 'BalooBhaina2-Regular',
    flex: 1,
  },
  saveButton: {
    margin: 24,
    marginBottom: 40,
    paddingVertical: 8,
  },
});
