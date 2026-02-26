import React from 'react';
import { ScrollView, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { PatientStackParamList } from '../../navigation/PatientNavigator';
import { NextActionCard } from '../../components/patient/NextActionCard';
import { WeatherInfoCard } from '../../components/patient/WeatherInfoCard';
import { Card } from '../../components/common/Card';
import { AccessibilityText } from '../../components/common/AccessibilityText';
import { BrandMark } from '../../components/common/BrandMark';
import { HomeFeatureTile } from '../../components/patient/HomeFeatureTile';
import { useNextAction } from '../../hooks/useNextAction';
import { useHomeWeather } from '../../hooks/useHomeWeather';
import { getAdherenceSummary, getDueMedication } from '../../data/db/repositories/medicationsRepo';
import { getNextUpcomingEvent } from '../../data/db/repositories/calendarRepo';

type Props = NativeStackScreenProps<PatientStackParamList, 'HomeHub'>;

export const HomeHubScreen = ({ navigation }: Props) => {
  const nextAction = useNextAction();
  const weather = useHomeWeather();
  const adherence = getAdherenceSummary();
  const nextEvent = getNextUpcomingEvent();
  const dueMedication = getDueMedication();
  const taken = adherence.taken;
  const total = Math.max(adherence.total, 1);
  const progressPercent = Math.max(0, Math.min(100, Math.round((taken / total) * 100)));
  const appointmentTime = nextEvent
    ? new Date(nextEvent.whenIso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    : '';

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const SummaryIcon = ({ icon, color }: { icon: string; color: string }) => (
    <View
      style={{
        width: 28,
        height: 28,
        borderRadius: 999,
        borderWidth: 1.75,
        borderColor: color,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
      }}
    >
      <AccessibilityText style={{ fontSize: 13, color, fontWeight: '700' }}>{icon}</AccessibilityText>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={{ padding: 16, backgroundColor: '#F9FAFB' }}>
      <View style={{ marginBottom: 12 }}>
        <BrandMark variant="medical" />
      </View>
      <NextActionCard
        title={nextAction.title}
        dueText={nextAction.dueText}
        ctaLabel={nextAction.ctaLabel}
        onPress={() => navigation.navigate(nextAction.targetScreen)}
      />
      <WeatherInfoCard
        icon={weather.icon}
        location={weather.location}
        temperature={weather.temperature}
        condition={weather.condition}
      />
      <Card style={{ backgroundColor: '#ECFEFF' }}>
        <AccessibilityText style={{ color: '#374151', fontSize: 16 }}>{`${greeting} 👋`}</AccessibilityText>
        <AccessibilityText style={{ marginTop: 6, fontSize: 36, fontWeight: '700', color: '#111827' }}>
          How are you feeling today?
        </AccessibilityText>
      </Card>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        <HomeFeatureTile label="Calendar" icon="📅" onPress={() => navigation.navigate('Today')} />
        <HomeFeatureTile label="Medications" icon="💊" onPress={() => navigation.navigate('MedList')} />
        <HomeFeatureTile label="Games" icon="🎮" onPress={() => navigation.navigate('BrainGames')} />
        <HomeFeatureTile label="Wellness" icon="✨" onPress={() => navigation.navigate('Wellness')} />
        <HomeFeatureTile label="Nutrition" icon="🥗" onPress={() => navigation.navigate('Nutrition')} />
        <HomeFeatureTile label="Companion" icon="💬" onPress={() => navigation.navigate('CallCaregiver')} />
      </View>

      <AccessibilityText style={{ marginTop: 8, marginBottom: 12, fontSize: 20, fontWeight: '700', color: '#111827' }}>
        Today's Summary
      </AccessibilityText>
      <Card style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 15 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <SummaryIcon icon="✓" color="#22C55E" />
          <View style={{ flex: 1 }}>
            <AccessibilityText style={{ fontSize: 16, fontWeight: '600', color: '#111827' }}>Medications</AccessibilityText>
            <AccessibilityText style={{ marginTop: 2, fontSize: 13, color: '#374151' }}>{`${taken} of ${total} taken`}</AccessibilityText>
          </View>
        </View>
        <View
          style={{
            width: 76,
            height: 9,
            borderRadius: 999,
            backgroundColor: '#D1D5DB',
            overflow: 'hidden',
            marginLeft: 12,
          }}
        >
          <View
            style={{
              width: `${progressPercent}%`,
              height: '100%',
              borderRadius: 999,
              backgroundColor: '#4F46E5',
            }}
          />
        </View>
      </Card>

      <Card style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 15 }}>
        <SummaryIcon icon="⏰" color="#0EA5E9" />
        <View style={{ flex: 1 }}>
          <AccessibilityText style={{ fontSize: 16, fontWeight: '600', color: '#111827' }}>Next Appointment</AccessibilityText>
          <AccessibilityText style={{ marginTop: 2, fontSize: 13, color: '#374151' }}>
            {nextEvent ? `${nextEvent.title}${appointmentTime ? ` at ${appointmentTime}` : ''}` : 'No upcoming appointment'}
          </AccessibilityText>
        </View>
      </Card>

      <Card style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 15 }}>
        <SummaryIcon icon="♡" color="#EF4444" />
        <View style={{ flex: 1 }}>
          <AccessibilityText style={{ fontSize: 16, fontWeight: '600', color: '#111827' }}>Mood</AccessibilityText>
          <AccessibilityText style={{ marginTop: 2, fontSize: 13, color: '#374151' }}>Feeling good today</AccessibilityText>
        </View>
      </Card>
    </ScrollView>
  );
};