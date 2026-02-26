import React from 'react';
import { Pressable, SafeAreaView, ScrollView, View } from 'react-native';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';
import { AccessibilityText } from '../../components/common/AccessibilityText';
import {
  getDueMedication,
  getMedicationDoseStatus,
  getMedications,
  setMedicationDoseStatus,
} from '../../data/db/repositories/medicationsRepo';

export const MedListScreen = () => {
  const [, setRefreshTick] = React.useState(0);
  const meds = getMedications();
  const parseTimeValue = (scheduleTime: string): number => {
    const match = scheduleTime.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!match) {
      return Number.MAX_SAFE_INTEGER;
    }

    const rawHour = Number(match[1]);
    const minutes = Number(match[2]);
    const period = match[3].toUpperCase();
    let hour24 = rawHour % 12;

    if (period === 'PM') {
      hour24 += 12;
    }

    return hour24 * 60 + minutes;
  };

  const sortByScheduleTime = (items: typeof meds) => {
    return [...items].sort((left, right) => parseTimeValue(left.scheduleTime) - parseTimeValue(right.scheduleTime));
  };

  const amMeds = sortByScheduleTime(meds.filter((med) => /\bAM\b/i.test(med.scheduleTime)));
  const pmMeds = sortByScheduleTime(meds.filter((med) => /\bPM\b/i.test(med.scheduleTime)));
  const dueMedication = getDueMedication();
  const activeCount = meds.filter((med) => med.active).length;

  const toggleDoseStatus = (medicationId: string) => {
    const medication = meds.find((item) => item.id === medicationId);
    if (!medication || !medication.active) {
      return;
    }

    const current = getMedicationDoseStatus(medication);
    const next = current === 'taken' ? 'planned' : 'taken';
    setMedicationDoseStatus(medication, next);
    setRefreshTick((value) => value + 1);
  };

  const renderMedicationCard = (medicationId: string) => {
    const med = meds.find((item) => item.id === medicationId);
    if (!med) {
      return null;
    }

    const doseStatus = getMedicationDoseStatus(med);
    const statusLabel = med.active
      ? doseStatus === 'taken'
        ? 'Taken'
        : doseStatus === 'missed'
          ? 'Missed'
          : 'Planned'
      : 'Paused';
    const statusBackground = !med.active
      ? '#F3F4F6'
      : doseStatus === 'taken'
        ? '#DCFCE7'
        : doseStatus === 'missed'
          ? '#FEE2E2'
          : '#E0E7FF';
    const statusColor = !med.active
      ? '#4B5563'
      : doseStatus === 'taken'
        ? '#166534'
        : doseStatus === 'missed'
          ? '#991B1B'
          : '#3730A3';

    return (
      <Card key={med.id} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 16 }}>
        <AccessibilityText style={{ fontSize: 24, marginRight: 12 }}>💊</AccessibilityText>
        <View style={{ flex: 1 }}>
          <AccessibilityText style={{ fontSize: 17, fontWeight: '600', color: '#111827' }}>{med.name}</AccessibilityText>
          <AccessibilityText style={{ marginTop: 2, fontSize: 13, color: '#374151' }}>{`${med.dose} • ${med.scheduleTime}`}</AccessibilityText>
          {med.instructions ? (
            <AccessibilityText style={{ marginTop: 2, fontSize: 12, color: '#6B7280' }}>{med.instructions}</AccessibilityText>
          ) : null}
        </View>
        <Pressable
          onPress={() => toggleDoseStatus(med.id)}
          disabled={!med.active}
          accessibilityRole="button"
          accessibilityLabel={
            doseStatus === 'missed'
              ? `Medication status ${statusLabel}. Tap to mark taken late`
              : `Medication status ${statusLabel}`
          }
          style={{
            borderRadius: 999,
            paddingHorizontal: 10,
            paddingVertical: 6,
            backgroundColor: statusBackground,
            marginLeft: 8,
            opacity: !med.active ? 0.9 : 1,
          }}
        >
          <AccessibilityText
            style={{
              fontSize: 11,
              fontWeight: '700',
              color: statusColor,
            }}
          >
            {statusLabel.toUpperCase()}
          </AccessibilityText>
        </Pressable>
      </Card>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 24 }}>
        <Header showBrand brandVariant="medical" title="Medicines" subtitle="Simple daily plan" />

        <Card style={{ backgroundColor: '#EEF2FF' }}>
          <AccessibilityText style={{ fontSize: 14, color: '#4B5563' }}>Today</AccessibilityText>
          <AccessibilityText style={{ marginTop: 4, fontSize: 22, fontWeight: '700', color: '#111827' }}>
            {`${activeCount} active medicine${activeCount === 1 ? '' : 's'}`}
          </AccessibilityText>
          <AccessibilityText style={{ marginTop: 6, fontSize: 14, color: '#374151' }}>
            {dueMedication
              ? `Next dose: ${dueMedication.name} at ${dueMedication.scheduleTime}`
              : 'No medicine due right now'}
          </AccessibilityText>
        </Card>

        <AccessibilityText style={{ marginTop: 6, marginBottom: 10, fontSize: 20, fontWeight: '700', color: '#111827' }}>
          Your medicines
        </AccessibilityText>

        {meds.length === 0 ? (
          <Card>
            <AccessibilityText style={{ fontSize: 16, color: '#374151' }}>No medicines listed yet.</AccessibilityText>
          </Card>
        ) : null}

        <AccessibilityText style={{ marginTop: 4, marginBottom: 8, fontSize: 16, fontWeight: '700', color: '#374151' }}>
          AM
        </AccessibilityText>
        {amMeds.length > 0 ? (
          amMeds.map((med) => renderMedicationCard(med.id))
        ) : (
          <Card>
            <AccessibilityText style={{ fontSize: 14, color: '#6B7280' }}>No morning medicines planned.</AccessibilityText>
          </Card>
        )}

        <AccessibilityText style={{ marginTop: 10, marginBottom: 8, fontSize: 16, fontWeight: '700', color: '#374151' }}>
          PM
        </AccessibilityText>
        {pmMeds.length > 0 ? (
          pmMeds.map((med) => renderMedicationCard(med.id))
        ) : (
          <Card>
            <AccessibilityText style={{ fontSize: 14, color: '#6B7280' }}>No evening medicines planned.</AccessibilityText>
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};