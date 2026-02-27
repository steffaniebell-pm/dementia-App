import React from 'react';
import { SafeAreaView, ScrollView, TextInput } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';
import { AccessibilityText } from '../../components/common/AccessibilityText';
import { LargeButton } from '../../components/common/LargeButton';
import { useAuth } from '../../app/providers/AuthProvider';
import { CaregiverStackParamList } from '../../navigation/CaregiverNavigator';
import { InlineToast } from '../../components/common/InlineToast';
import { useInlineToast } from '../../hooks/useInlineToast';
import {
  getPatientProfile,
  getPrimaryEmergencyContact,
  setPrimaryEmergencyContact,
  setQuietHours,
  setReminderTone,
} from '../../data/db/repositories/patientProfileRepo';

type Props = NativeStackScreenProps<CaregiverStackParamList, 'Settings'>;

export const SettingsScreen = ({ navigation }: Props) => {
  const { signOut, setPin, removePin, hasPin } = useAuth();
  const [pinDraft, setPinDraft] = React.useState('');
  const [refreshTick, setRefreshTick] = React.useState(0);
  const [emergencyName, setEmergencyName] = React.useState('');
  const [emergencyPhone, setEmergencyPhone] = React.useState('');
  const { toastMessage, showToast } = useInlineToast();
  const profile = React.useMemo(() => getPatientProfile(), [refreshTick]);

  React.useEffect(() => {
    const primary = getPrimaryEmergencyContact();
    setEmergencyName(primary?.name ?? '');
    setEmergencyPhone(primary?.phone ?? '');
  }, [refreshTick]);

  const onSavePin = () => {
    if (pinDraft.length !== 4) {
      showToast('PIN must be 4 digits.');
      return;
    }
    setPin(pinDraft);
    setPinDraft('');
    showToast('PIN saved.');
  };

  const onRemovePin = () => {
    removePin();
    setPinDraft('');
    showToast('PIN removed.');
  };

  const applyQuietHours = (start?: string, end?: string) => {
    if (start && end) {
      setQuietHours({ start, end });
      showToast(`Quiet hours set: ${start}–${end}`);
    } else {
      setQuietHours(undefined);
      showToast('Quiet hours turned off.');
    }
    setRefreshTick((current) => current + 1);
  };

  const applyReminderTone = (tone: 'soft' | 'standard') => {
    setReminderTone(tone);
    setRefreshTick((current) => current + 1);
    showToast(`Reminder tone set: ${tone === 'soft' ? 'Soft' : 'Standard'}`);
  };

  const saveEmergencyContact = () => {
    if (!emergencyName.trim() || !emergencyPhone.trim()) {
      showToast('Enter both name and phone.');
      return;
    }

    setPrimaryEmergencyContact(emergencyName, emergencyPhone);
    setRefreshTick((current) => current + 1);
    showToast('Emergency contact saved.');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#B8CEDB' }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 24 }}>
        <Header showBrand brandVariant="spark" title="Settings" subtitle="Simple actions" />
        <Card style={{ backgroundColor: '#B8CEDB' }}>
          <AccessibilityText style={{ fontSize: 14, color: '#4D217A' }}>Overview</AccessibilityText>
          <AccessibilityText style={{ marginTop: 4, fontSize: 22, fontWeight: '700', color: '#4D217A' }}>
            Caregiver settings
          </AccessibilityText>
          <AccessibilityText style={{ marginTop: 6, fontSize: 14, color: '#4D217A' }}>
            Use these settings only when needed. Keep daily tasks on Home for a simpler routine.
          </AccessibilityText>
        </Card>
        <Card>
        <AccessibilityText style={{ fontWeight: '700', marginBottom: 8 }}>App PIN (optional)</AccessibilityText>
        <TextInput
          value={pinDraft}
          onChangeText={(text) => setPinDraft(text.replace(/[^0-9]/g, '').slice(0, 4))}
          keyboardType="number-pad"
          secureTextEntry
          placeholder={hasPin ? 'Enter new 4-digit PIN' : 'Enter 4-digit PIN'}
          style={{
            borderWidth: 1,
            borderColor: '#B8CEDB',
            borderRadius: 10,
            paddingHorizontal: 12,
            paddingVertical: 10,
            fontSize: 18,
            marginBottom: 8,
          }}
        />
        <LargeButton label={hasPin ? 'Update PIN' : 'Set PIN'} onPress={onSavePin} />
        {hasPin ? <LargeButton label="Remove PIN" onPress={onRemovePin} /> : null}
      </Card>
      <Card>
        <AccessibilityText style={{ fontWeight: '700', marginBottom: 8 }}>Quiet Hours</AccessibilityText>
        <AccessibilityText style={{ marginBottom: 8 }}>
          {profile.quietHours
            ? `Current: ${profile.quietHours.start}–${profile.quietHours.end}`
            : 'Current: Off'}
        </AccessibilityText>
        <LargeButton label="8 PM – 7 AM" onPress={() => applyQuietHours('20:00', '07:00')} />
        <LargeButton label="9 PM – 6 AM" onPress={() => applyQuietHours('21:00', '06:00')} />
        <LargeButton label="Turn Off" onPress={() => applyQuietHours()} />
      </Card>
      <Card>
        <AccessibilityText style={{ fontWeight: '700', marginBottom: 8 }}>Reminder Tone</AccessibilityText>
        <AccessibilityText style={{ marginBottom: 8 }}>
          {`Current: ${profile.reminderTone === 'soft' ? 'Soft' : 'Standard'}`}
        </AccessibilityText>
        <LargeButton label="Soft" onPress={() => applyReminderTone('soft')} />
        <LargeButton label="Standard" onPress={() => applyReminderTone('standard')} />
      </Card>
      <Card>
        <AccessibilityText style={{ fontWeight: '700', marginBottom: 8 }}>Emergency Contact</AccessibilityText>
        <TextInput
          value={emergencyName}
          onChangeText={setEmergencyName}
          placeholder="Name"
          style={{
            borderWidth: 1,
            borderColor: '#B8CEDB',
            borderRadius: 10,
            paddingHorizontal: 12,
            paddingVertical: 10,
            fontSize: 16,
            marginBottom: 8,
          }}
        />
        <TextInput
          value={emergencyPhone}
          onChangeText={(text) => setEmergencyPhone(text.replace(/[^0-9+\-() ]/g, '').slice(0, 24))}
          keyboardType="phone-pad"
          placeholder="Phone"
          style={{
            borderWidth: 1,
            borderColor: '#B8CEDB',
            borderRadius: 10,
            paddingHorizontal: 12,
            paddingVertical: 10,
            fontSize: 16,
            marginBottom: 8,
          }}
        />
        <LargeButton label="Save Contact" onPress={saveEmergencyContact} />
      </Card>
      <InlineToast message={toastMessage} />
      <LargeButton label="Pairing" onPress={() => navigation.navigate('Pairing')} />
      <LargeButton label="Emergency Info" onPress={() => navigation.navigate('EmergencyInfo')} />
      <LargeButton label="Lock App" onPress={signOut} style={{ backgroundColor: '#F6E600' }} />
      </ScrollView>
    </SafeAreaView>
  );
};