import React from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';
import { AccessibilityText } from '../../components/common/AccessibilityText';

export const EmergencyInfoScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#B8CEDB' }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 24 }}>
        <Header showBrand brandVariant="spark" title="Emergency Info" subtitle="Critical care notes" />
        <Card style={{ backgroundColor: '#B8CEDB' }}>
          <AccessibilityText style={{ fontSize: 14, color: '#4D217A' }}>Overview</AccessibilityText>
          <AccessibilityText style={{ marginTop: 4, fontSize: 22, fontWeight: '700', color: '#4D217A' }}>
            Emergency essentials
          </AccessibilityText>
          <AccessibilityText style={{ marginTop: 6, fontSize: 14, color: '#4D217A' }}>
            Store contacts, allergies, and care notes.
          </AccessibilityText>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};