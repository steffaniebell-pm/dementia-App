import React from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';
import { AccessibilityText } from '../../components/common/AccessibilityText';
import { LargeButton } from '../../components/common/LargeButton';
import { InlineToast } from '../../components/common/InlineToast';
import {
  getMedications,
  removeAllMedications,
  removeMedication,
  upsertMedication,
} from '../../data/db/repositories/medicationsRepo';
import { createUuid } from '../../utils/uuid';
import { Medication } from '../../domain/models';
import { useInlineToast } from '../../hooks/useInlineToast';
import { useUndoWindow } from '../../hooks/useUndoWindow';
import { confirmDestructiveAction } from '../../utils/confirm';

export const ManageMedsScreen = () => {
  const [, setRefreshTick] = React.useState(0);
  const { undoAction, startUndoWindow, consumeUndo } = useUndoWindow();
  const { toastMessage, showToast } = useInlineToast();
  const meds = getMedications();

  const addMedication = () => {
    upsertMedication({
      id: createUuid(),
      name: 'New Medication',
      dose: '5 mg',
      scheduleTime: '06:00 PM',
      active: true,
      instructions: 'Take with food',
      startDateIso: new Date().toISOString(),
    });
    setRefreshTick((current) => current + 1);
    showToast('Medication added.');
  };

  const deleteMedication = (id: string) => {
    confirmDestructiveAction({
      title: 'Remove medication?',
      message: 'This action cannot be undone.',
      confirmLabel: 'Remove',
      onConfirm: () => {
        const removed = meds.find((medication) => medication.id === id);
        removeMedication(id);
        if (removed) {
          startUndoWindow({
            label: `${removed.name} removed`,
            undo: () => {
              upsertMedication(removed);
              showToast('Medication restored.');
            },
          });
        }
        setRefreshTick((current) => current + 1);
        showToast('Medication removed.');
      },
    });
  };

  const clearMedications = () => {
    confirmDestructiveAction({
      title: 'Clear all medications?',
      message: 'This will remove all medication entries.',
      confirmLabel: 'Clear All',
      onConfirm: () => {
        const snapshot: Medication[] = [...meds];
        removeAllMedications();
        if (snapshot.length > 0) {
          startUndoWindow({
            label: 'All medications cleared',
            undo: () => {
              snapshot.forEach((medication) => {
                upsertMedication(medication);
              });
              showToast('Medications restored.');
            },
          });
        }
        setRefreshTick((current) => current + 1);
        showToast('All medications cleared.');
      },
    });
  };

  const onUndo = () => {
    const didUndo = consumeUndo();
    if (!didUndo) {
      return;
    }

    setRefreshTick((current) => current + 1);
    showToast('Undo complete.');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Header showBrand brandVariant="spark" title="Manage Medications" subtitle="Add and edit schedules" />
        <Card style={{ backgroundColor: '#EEF2FF' }}>
          <AccessibilityText style={{ fontSize: 14, color: '#4B5563' }}>Overview</AccessibilityText>
          <AccessibilityText style={{ marginTop: 4, fontSize: 22, fontWeight: '700', color: '#111827' }}>
            {`${meds.length} medicine${meds.length === 1 ? '' : 's'}`}
          </AccessibilityText>
          <AccessibilityText style={{ marginTop: 6, fontSize: 14, color: '#374151' }}>
            Add, remove, or clear medications as needed.
          </AccessibilityText>
        </Card>
        <AccessibilityText style={{ marginTop: 6, marginBottom: 10, fontSize: 20, fontWeight: '700', color: '#111827' }}>
          Quick actions
        </AccessibilityText>
        <LargeButton label="Add Medication" onPress={addMedication} />
        <LargeButton
          label="Clear All Medications"
          onPress={clearMedications}
          style={{ backgroundColor: '#DC2626' }}
        />
        <InlineToast message={toastMessage} />
        {undoAction ? (
          <Card>
            <AccessibilityText style={{ fontWeight: '700' }}>{undoAction.label}</AccessibilityText>
            <AccessibilityText style={{ marginTop: 4 }}>Undo available for 5 seconds.</AccessibilityText>
            <LargeButton label="Undo" onPress={onUndo} style={{ marginTop: 10 }} />
          </Card>
        ) : null}
        <AccessibilityText style={{ marginTop: 6, marginBottom: 10, fontSize: 20, fontWeight: '700', color: '#111827' }}>
          Medication list
        </AccessibilityText>
        {meds.map((medication) => (
          <Card key={medication.id} style={{ paddingVertical: 16 }}>
            <AccessibilityText style={{ fontWeight: '700', fontSize: 17 }}>{medication.name}</AccessibilityText>
            <AccessibilityText style={{ marginTop: 2, fontSize: 13, color: '#374151' }}>{`${medication.dose} • ${medication.scheduleTime}`}</AccessibilityText>
            <AccessibilityText style={{ marginTop: 2, fontSize: 12, color: '#6B7280' }}>
              {medication.instructions ?? 'No instructions'}
            </AccessibilityText>
            <LargeButton
              label="Remove Medication"
              onPress={() => deleteMedication(medication.id)}
              style={{ marginTop: 10, backgroundColor: '#DC2626' }}
            />
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};