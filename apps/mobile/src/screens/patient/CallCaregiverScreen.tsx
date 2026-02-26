import React from 'react';
import { SafeAreaView } from 'react-native';
import { Header } from '../../components/common/Header';
import { LargeButton } from '../../components/common/LargeButton';

export const CallCaregiverScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      <Header showBrand brandVariant="medical" title="Call caregiver" subtitle="Reach out for support" />
      <LargeButton label="Call Now" onPress={() => undefined} />
    </SafeAreaView>
  );
};