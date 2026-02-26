import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, Pressable, TextInput, View } from 'react-native';
import { PatientNavigator } from './PatientNavigator';
import { CaregiverNavigator } from './CaregiverNavigator';
import { linking } from './linking';
import { useRole } from '../hooks/useRole';
import { useDb } from '../app/providers/DbProvider';
import { useAuth } from '../app/providers/AuthProvider';
import { Header } from '../components/common/Header';
import { LargeButton } from '../components/common/LargeButton';
import { Card } from '../components/common/Card';
import { AccessibilityText } from '../components/common/AccessibilityText';
import { isRoleDemoSwitchEnabled } from '../config/runtimeFlags';

export const RootNavigator = () => {
  const { role, setRole, toggleRole } = useRole();
  const { isAuthenticated, currentRole, signIn, authMode, hasPin, unlockWithPin } = useAuth();
  const { ready } = useDb();
  const [pinInput, setPinInput] = React.useState('');
  const [pinError, setPinError] = React.useState<string | null>(null);
  const roleChipLabel = role === 'patient' ? '⟡ Patient' : '⟡ Caregiver';
  const roleChipActionLabel = role === 'patient' ? 'Switch to Caregiver' : 'Switch to Patient';

  React.useEffect(() => {
    if (isAuthenticated) {
      setRole(currentRole);
    }
  }, [currentRole, isAuthenticated, setRole]);

  if (!ready) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!isAuthenticated) {
    const onUnlock = () => {
      const ok = unlockWithPin(pinInput.trim());
      if (!ok) {
        setPinError('PIN did not match. Please try again.');
        return;
      }
      setPinError(null);
      setPinInput('');
    };

    return (
      <View style={{ flex: 1, justifyContent: 'center', padding: 16 }}>
        <Header title="Welcome" subtitle="Local mode (no API key required)" />
        <Card>
          <AccessibilityText>
            {`Auth mode: ${authMode}. Continue with local device session for development.`}
          </AccessibilityText>
        </Card>
        {hasPin ? (
          <>
            <Card>
              <AccessibilityText style={{ marginBottom: 8 }}>Enter your 4-digit PIN</AccessibilityText>
              <TextInput
                value={pinInput}
                onChangeText={(text) => setPinInput(text.replace(/[^0-9]/g, '').slice(0, 4))}
                keyboardType="number-pad"
                secureTextEntry
                placeholder="PIN"
                style={{
                  borderWidth: 1,
                  borderColor: '#D1D5DB',
                  borderRadius: 10,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  fontSize: 18,
                }}
              />
              {pinError ? <AccessibilityText style={{ color: '#DC2626', marginTop: 8 }}>{pinError}</AccessibilityText> : null}
            </Card>
            <LargeButton label="Unlock" onPress={onUnlock} />
          </>
        ) : (
          <>
            <LargeButton
              label="Continue as Patient"
              onPress={() => {
                signIn('patient');
              }}
            />
            <LargeButton
              label="Continue as Caregiver"
              onPress={() => {
                signIn('caregiver');
              }}
            />
          </>
        )}
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <NavigationContainer linking={linking}>
        {role === 'patient' ? <PatientNavigator /> : <CaregiverNavigator />}
      </NavigationContainer>
      {isRoleDemoSwitchEnabled ? (
        <View
          pointerEvents="box-none"
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 1000,
          }}
        >
          <Pressable
            onPress={toggleRole}
            accessibilityRole="button"
            accessibilityLabel={roleChipActionLabel}
            style={{
              backgroundColor: '#F5F3FF',
              borderRadius: 999,
              paddingHorizontal: 10,
              paddingVertical: 6,
              opacity: 0.82,
            }}
          >
            <AccessibilityText style={{ color: '#6D28D9', fontSize: 13, fontWeight: '500' }}>{roleChipLabel}</AccessibilityText>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
};