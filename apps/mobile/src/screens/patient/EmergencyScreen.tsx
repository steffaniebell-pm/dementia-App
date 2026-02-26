import React from 'react';
import { SafeAreaView } from 'react-native';
import { Header } from '../../components/common/Header';
import { LargeButton } from '../../components/common/LargeButton';

export const EmergencyScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      <Header showBrand brandVariant="medical" title="Emergency" subtitle="Get immediate help" />
      <LargeButton label="Call Emergency Services" onPress={() => undefined} />
    </SafeAreaView>
  );
};