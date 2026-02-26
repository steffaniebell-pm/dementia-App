import React from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Header } from '../../components/common/Header';
import { CaregiverStackParamList } from '../../navigation/CaregiverNavigator';
import { Card } from '../../components/common/Card';
import { AccessibilityText } from '../../components/common/AccessibilityText';
import { CaregiverActionTile } from '../../components/caregiver/CaregiverActionTile';
import { getAdherenceSummary } from '../../data/db/repositories/medicationsRepo';
import { getNextUpcomingEvent } from '../../data/db/repositories/calendarRepo';
import { getEscalationEvents } from '../../data/sync/syncEngine';

type Props = NativeStackScreenProps<CaregiverStackParamList, 'Dashboard'>;

export const DashboardScreen = ({ navigation }: Props) => {
  const adherence = getAdherenceSummary();
  const nextEvent = getNextUpcomingEvent();
  const escalations = getEscalationEvents(30);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 24 }}>
        <Header showBrand brandVariant="spark" title="Caregiver Home" subtitle="Daily support" />
        <Card style={{ backgroundColor: '#EEF2FF' }}>
          <AccessibilityText style={{ fontSize: 14, color: '#4B5563' }}>Today</AccessibilityText>
          <AccessibilityText style={{ marginTop: 4, fontSize: 22, fontWeight: '700', color: '#111827' }}>
            Care overview
          </AccessibilityText>
          <AccessibilityText style={{ marginTop: 6, fontSize: 14, color: '#374151' }}>
            {`Missed reminders: ${escalations.length}`}
          </AccessibilityText>
        </Card>
        <Card style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 16 }}>
          <AccessibilityText style={{ fontSize: 24, marginRight: 12 }}>💊</AccessibilityText>
          <View style={{ flex: 1 }}>
            <AccessibilityText style={{ fontWeight: '700', fontSize: 16 }}>Medication progress (7 days)</AccessibilityText>
            <AccessibilityText style={{ marginTop: 2, fontSize: 13, color: '#374151' }}>{`${adherence.rate}% taken`}</AccessibilityText>
          </View>
        </Card>
        <Card style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 16 }}>
          <AccessibilityText style={{ fontSize: 24, marginRight: 12 }}>🗓️</AccessibilityText>
          <View style={{ flex: 1 }}>
            <AccessibilityText style={{ fontWeight: '700', fontSize: 16 }}>Next appointment</AccessibilityText>
            <AccessibilityText style={{ marginTop: 2, fontSize: 13, color: '#374151' }}>
              {nextEvent ? nextEvent.title : 'No upcoming events'}
            </AccessibilityText>
          </View>
        </Card>
        <AccessibilityText style={{ marginTop: 6, marginBottom: 10, fontSize: 20, fontWeight: '700', color: '#111827' }}>
          Actions
        </AccessibilityText>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <CaregiverActionTile label="Medicines" icon="💊" onPress={() => navigation.navigate('ManageMeds')} />
          <CaregiverActionTile label="Calendar" icon="📅" onPress={() => navigation.navigate('ManageCalendar')} />
          <CaregiverActionTile label="Reports" icon="📈" onPress={() => navigation.navigate('Reports')} />
          <CaregiverActionTile label="Settings" icon="⚙️" onPress={() => navigation.navigate('Settings')} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};