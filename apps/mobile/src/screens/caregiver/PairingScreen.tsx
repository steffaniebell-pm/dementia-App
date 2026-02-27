import React from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';
import { AccessibilityText } from '../../components/common/AccessibilityText';
import { LargeButton } from '../../components/common/LargeButton';
import { createInviteCode, acceptInviteCode, getSharedProfile, setDignityAccess } from '../../data/db/repositories/pairingRepo';

export const PairingScreen = () => {
  const [inviteCode, setInviteCode] = React.useState('');
  const [message, setMessage] = React.useState('');
  const profile = getSharedProfile();

  const onGenerateCode = () => {
    const invite = createInviteCode(profile.patientDisplayName, profile.dignityAccess);
    setInviteCode(invite.code);
    setMessage('Invite code generated. Share with patient.');
  };

  const onAccept = () => {
    const result = acceptInviteCode(inviteCode);
    setMessage(result.message);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#B8CEDB' }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 24 }}>
        <Header showBrand brandVariant="spark" title="Pairing" subtitle="Invite code workflow" />
        <Card style={{ backgroundColor: '#B8CEDB' }}>
          <AccessibilityText style={{ fontSize: 14, color: '#4D217A' }}>Status</AccessibilityText>
          <AccessibilityText style={{ marginTop: 4, fontSize: 22, fontWeight: '700', color: '#4D217A' }}>
            {profile.caregiverLinked ? 'Connected' : 'Not connected'}
          </AccessibilityText>
          <AccessibilityText style={{ marginTop: 6, fontSize: 14, color: '#4D217A' }}>
            {`Dignity access: ${profile.dignityAccess}`}
          </AccessibilityText>
        </Card>
        <Card>
          <AccessibilityText>{`Current code: ${inviteCode || 'Not generated'}`}</AccessibilityText>
          {message ? <AccessibilityText style={{ marginTop: 8 }}>{message}</AccessibilityText> : null}
        </Card>
        <AccessibilityText style={{ marginTop: 6, marginBottom: 10, fontSize: 20, fontWeight: '700', color: '#4D217A' }}>
          Pairing actions
        </AccessibilityText>
        <LargeButton label="Generate Invite Code" onPress={onGenerateCode} />
        <LargeButton label="Accept Current Code" onPress={onAccept} />
        <LargeButton label="Set Dignity: View" onPress={() => setDignityAccess('view')} />
        <LargeButton label="Set Dignity: Edit" onPress={() => setDignityAccess('edit')} />
      </ScrollView>
    </SafeAreaView>
  );
};