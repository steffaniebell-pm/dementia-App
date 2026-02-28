import React from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';
import { AccessibilityText } from '../../components/common/AccessibilityText';
import { getTodayCalendarItems } from '../../data/db/repositories/calendarRepo';
import { CalendarItem } from '../../domain/models';

const getTypeLabel = (type: CalendarItem['type']) => {
  if (type === 'appointment') {
    return 'Appointment';
  }
  if (type === 'reminder') {
    return 'Reminder';
  }
  return 'Activity';
};

const getTypeIcon = (type: CalendarItem['type']) => {
  if (type === 'appointment') {
    return '🩺';
  }
  if (type === 'reminder') {
    return '🔔';
  }
  return '🚶';
};

const formatTime = (whenIso: string) => {
  const parsed = new Date(whenIso);
  if (Number.isNaN(parsed.getTime())) {
    return '';
  }

  return parsed.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
};

export const TodayScreen = () => {
  const events = getTodayCalendarItems();
  const nextEvent = events[0];
  const todayLabel = new Date().toLocaleDateString([], {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 24 }}>
        <Header showBrand brandVariant="medical" title="Calendar" subtitle="Today at a glance" />

        <Card style={{ backgroundColor: '#FFFFFF' }}>
          <AccessibilityText style={{ fontSize: 14, color: '#4D217A' }}>Today</AccessibilityText>
          <AccessibilityText style={{ marginTop: 4, fontSize: 22, fontWeight: '700', color: '#4D217A' }}>
            {todayLabel}
          </AccessibilityText>
        </Card>

        <AccessibilityText style={{ marginTop: 6, marginBottom: 10, fontSize: 20, fontWeight: '700', color: '#4D217A' }}>
          Next up
        </AccessibilityText>
        <Card style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 16 }}>
          <AccessibilityText style={{ fontSize: 24, marginRight: 12, color: '#8A00E5' }}>⏰</AccessibilityText>
          <View style={{ flex: 1 }}>
            <AccessibilityText style={{ fontSize: 16, fontWeight: '600', color: '#4D217A' }}>
              {nextEvent ? nextEvent.title : 'No events planned'}
            </AccessibilityText>
            <AccessibilityText style={{ marginTop: 2, fontSize: 13, color: '#4D217A' }}>
              {nextEvent ? formatTime(nextEvent.whenIso) || getTypeLabel(nextEvent.type) : 'Enjoy your free time'}
            </AccessibilityText>
          </View>
        </Card>

        <AccessibilityText style={{ marginTop: 6, marginBottom: 10, fontSize: 20, fontWeight: '700', color: '#4D217A' }}>
          Today’s schedule
        </AccessibilityText>
        {events.length === 0 ? (
          <Card>
            <AccessibilityText style={{ fontSize: 16, color: '#4D217A' }}>No events today.</AccessibilityText>
          </Card>
        ) : (
          events.map((event) => (
            <Card key={event.id} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 16 }}>
              <AccessibilityText style={{ fontSize: 24, marginRight: 12 }}>{getTypeIcon(event.type)}</AccessibilityText>
              <View style={{ flex: 1 }}>
                <AccessibilityText style={{ fontSize: 16, fontWeight: '600', color: '#4D217A' }}>{event.title}</AccessibilityText>
                <AccessibilityText style={{ marginTop: 2, fontSize: 13, color: '#4D217A' }}>
                  {`${getTypeLabel(event.type)}${formatTime(event.whenIso) ? ` • ${formatTime(event.whenIso)}` : ''}`}
                </AccessibilityText>
                {event.location ? (
                  <AccessibilityText style={{ marginTop: 2, fontSize: 12, color: '#4D217A' }}>{event.location}</AccessibilityText>
                ) : null}
              </View>
            </Card>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};