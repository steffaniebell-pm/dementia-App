import React from 'react';
import { SafeAreaView, View } from 'react-native';
import { Header } from '../../components/common/Header';
import { LargeButton } from '../../components/common/LargeButton';
import { Card } from '../../components/common/Card';
import { AccessibilityText } from '../../components/common/AccessibilityText';
import { InlineToast } from '../../components/common/InlineToast';
import { getDueMedication, logMedicationAction } from '../../data/db/repositories/medicationsRepo';
import { enqueueOutbox } from '../../data/sync/outbox';
import { runSync } from '../../data/sync/syncEngine';
import { useInlineToast } from '../../hooks/useInlineToast';

export const MedNowScreen = () => {
  const { toastMessage, showToast } = useInlineToast();
  const dueMedication = getDueMedication();

  const submitAction = async (action: 'taken' | 'snooze' | 'skip') => {
    if (!dueMedication) {
      showToast("You're all set for now.");
      return;
    }

    const log = logMedicationAction(dueMedication.id, action, 'pending');
    enqueueOutbox('MED_ACTION', {
      medicationId: dueMedication.id,
      action,
      medicationLogId: log.id,
    });
    showToast(action === 'taken' ? 'Great job. Medication logged.' : "Okay, we'll remind you soon.");
    await runSync();
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 16, backgroundColor: '#F9FAFB' }}>
      <Header showBrand brandVariant="medical" title="Medicine now" subtitle={dueMedication ? 'One step at a time' : 'No medicine due now'} />

      <Card style={{ backgroundColor: '#EEF2FF' }}>
        <AccessibilityText style={{ fontSize: 14, color: '#4B5563' }}>Right now</AccessibilityText>
        <AccessibilityText style={{ marginTop: 4, fontSize: 22, fontWeight: '700', color: '#111827' }}>
          {dueMedication ? 'Medicine reminder' : 'All set'}
        </AccessibilityText>
        <AccessibilityText style={{ marginTop: 6, fontSize: 14, color: '#374151' }}>
          {dueMedication ? `It's time for ${dueMedication.name}.` : 'No medicine is due at the moment.'}
        </AccessibilityText>
      </Card>

      {dueMedication ? (
        <Card style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 16 }}>
          <AccessibilityText style={{ fontSize: 24, marginRight: 12 }}>💊</AccessibilityText>
          <View style={{ flex: 1 }}>
            <AccessibilityText style={{ fontSize: 18, fontWeight: '700', color: '#111827' }}>{dueMedication.name}</AccessibilityText>
            <AccessibilityText style={{ marginTop: 3, fontSize: 13, color: '#374151' }}>{`${dueMedication.dose} • ${dueMedication.scheduleTime}`}</AccessibilityText>
          </View>
        </Card>
      ) : (
        <Card>
          <AccessibilityText style={{ fontSize: 16, color: '#374151' }}>You can return later for your next reminder.</AccessibilityText>
        </Card>
      )}

      {dueMedication ? (
        <AccessibilityText style={{ marginTop: 6, marginBottom: 10, fontSize: 20, fontWeight: '700', color: '#111827' }}>
          What would you like to do?
        </AccessibilityText>
      ) : null}

      <View style={{ marginTop: 8 }}>
        <LargeButton label="Taken" onPress={() => void submitAction('taken')} />
        <LargeButton label="Snooze" onPress={() => void submitAction('snooze')} />
        <LargeButton label="Skip" onPress={() => void submitAction('skip')} />
      </View>
      <InlineToast message={toastMessage} />
    </SafeAreaView>
  );
};