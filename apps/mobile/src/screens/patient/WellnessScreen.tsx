import React from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Header } from '../../components/common/Header';
import { PatientStackParamList } from '../../navigation/PatientNavigator';
import { Card } from '../../components/common/Card';
import { AccessibilityText } from '../../components/common/AccessibilityText';
import { LargeButton } from '../../components/common/LargeButton';
import { getWellnessSessions } from '../../data/db/repositories/wellnessRepo';

type Props = NativeStackScreenProps<PatientStackParamList, 'Wellness'>;

export const WellnessScreen = ({ navigation }: Props) => {
  const sessions = getWellnessSessions();

  const getIcon = (title: string) => {
    const lower = title.toLowerCase();
    if (lower.includes('yoga')) {
      return '🧘';
    }
    if (lower.includes('cardio')) {
      return '🏃';
    }
    if (lower.includes('calm') || lower.includes('breath')) {
      return '🌿';
    }
    return '💪';
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 24 }}>
        <Header showBrand brandVariant="medical" title="Wellness" subtitle="Move, stretch, and relax" />

        <Card style={{ backgroundColor: '#FFFFFF' }}>
          <AccessibilityText style={{ fontSize: 14, color: '#4D217A' }}>Today</AccessibilityText>
          <AccessibilityText style={{ marginTop: 4, fontSize: 22, fontWeight: '700', color: '#4D217A' }}>
            Take a wellness break
          </AccessibilityText>
          <AccessibilityText style={{ marginTop: 6, fontSize: 14, color: '#4D217A' }}>
            Choose one short session to support comfort and focus.
          </AccessibilityText>
        </Card>

        <AccessibilityText style={{ marginTop: 6, marginBottom: 10, fontSize: 20, fontWeight: '700', color: '#4D217A' }}>
          Sessions
        </AccessibilityText>

        {sessions.map((session) => (
          <Card
            key={session.id}
            style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 16 }}
          >
            <AccessibilityText style={{ fontSize: 24, marginRight: 12 }}>{getIcon(session.title)}</AccessibilityText>
            <View style={{ flex: 1 }}>
              <AccessibilityText style={{ fontSize: 17, fontWeight: '600', color: '#4D217A' }}>{session.title}</AccessibilityText>
              <AccessibilityText style={{ marginTop: 2, fontSize: 13, color: '#4D217A' }}>
                {`${session.durationMinutes} min`}
              </AccessibilityText>
            </View>
            <LargeButton
              label="Start"
              onPress={() => navigation.navigate('WellnessSessionPlayer')}
              style={{ marginBottom: 0, paddingVertical: 10, paddingHorizontal: 14 }}
            />
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};