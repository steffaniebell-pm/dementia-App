import React from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';
import { AccessibilityText } from '../../components/common/AccessibilityText';
import { LargeButton } from '../../components/common/LargeButton';
import { InlineToast } from '../../components/common/InlineToast';
import {
  getCalendarItems,
  removeAllCalendarItems,
  removeCalendarItem,
  upsertCalendarItem,
} from '../../data/db/repositories/calendarRepo';
import { createUuid } from '../../utils/uuid';
import { CalendarItem } from '../../domain/models';
import { useInlineToast } from '../../hooks/useInlineToast';
import { useUndoWindow } from '../../hooks/useUndoWindow';
import { confirmDestructiveAction } from '../../utils/confirm';

export const ManageCalendarScreen = () => {
  const [, setRefreshTick] = React.useState(0);
  const { undoAction, startUndoWindow, consumeUndo } = useUndoWindow();
  const { toastMessage, showToast } = useInlineToast();
  const items = getCalendarItems();

  const addEvent = () => {
    upsertCalendarItem({
      id: createUuid(),
      title: 'New Event',
      whenIso: new Date(Date.now() + 3_600_000).toISOString(),
      type: 'appointment',
      location: 'Clinic',
      notes: 'Bring medication list',
      color: '#8A00E5',
      reminderMinutesBefore: 30,
    });
    setRefreshTick((current) => current + 1);
    showToast('Event added.');
  };

  const deleteEvent = (id: string) => {
    confirmDestructiveAction({
      title: 'Remove event?',
      message: 'This action cannot be undone.',
      confirmLabel: 'Remove',
      onConfirm: () => {
        const removed = items.find((item) => item.id === id);
        removeCalendarItem(id);
        if (removed) {
          startUndoWindow({
            label: `${removed.title} removed`,
            undo: () => {
              upsertCalendarItem(removed);
              showToast('Event restored.');
            },
          });
        }
        setRefreshTick((current) => current + 1);
        showToast('Event removed.');
      },
    });
  };

  const clearEvents = () => {
    confirmDestructiveAction({
      title: 'Clear all events?',
      message: 'This will remove all calendar events.',
      confirmLabel: 'Clear All',
      onConfirm: () => {
        const snapshot: CalendarItem[] = [...items];
        removeAllCalendarItems();
        if (snapshot.length > 0) {
          startUndoWindow({
            label: 'All events cleared',
            undo: () => {
              snapshot.forEach((item) => {
                upsertCalendarItem(item);
              });
              showToast('Events restored.');
            },
          });
        }
        setRefreshTick((current) => current + 1);
        showToast('All events cleared.');
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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Header showBrand brandVariant="spark" title="Manage Calendar" subtitle="Appointments and reminders" />
        <Card style={{ backgroundColor: '#FFFFFF' }}>
          <AccessibilityText style={{ fontSize: 14, color: '#4D217A' }}>Overview</AccessibilityText>
          <AccessibilityText style={{ marginTop: 4, fontSize: 22, fontWeight: '700', color: '#4D217A' }}>
            {`${items.length} event${items.length === 1 ? '' : 's'}`}
          </AccessibilityText>
          <AccessibilityText style={{ marginTop: 6, fontSize: 14, color: '#4D217A' }}>
            Keep appointments and reminders up to date.
          </AccessibilityText>
        </Card>
        <AccessibilityText style={{ marginTop: 6, marginBottom: 10, fontSize: 20, fontWeight: '700', color: '#4D217A' }}>
          Quick actions
        </AccessibilityText>
        <LargeButton label="Add Event" onPress={addEvent} />
        <LargeButton label="Clear All Events" onPress={clearEvents} style={{ backgroundColor: '#F6E600' }} />
        <InlineToast message={toastMessage} />
        {undoAction ? (
          <Card>
            <AccessibilityText style={{ fontWeight: '700' }}>{undoAction.label}</AccessibilityText>
            <AccessibilityText style={{ marginTop: 4 }}>Undo available for 5 seconds.</AccessibilityText>
            <LargeButton label="Undo" onPress={onUndo} style={{ marginTop: 10 }} />
          </Card>
        ) : null}
        <AccessibilityText style={{ marginTop: 6, marginBottom: 10, fontSize: 20, fontWeight: '700', color: '#4D217A' }}>
          Calendar list
        </AccessibilityText>
        {items.map((item) => (
          <Card key={item.id} style={{ paddingVertical: 16 }}>
            <AccessibilityText style={{ fontWeight: '700', fontSize: 17 }}>{item.title}</AccessibilityText>
            <AccessibilityText style={{ marginTop: 2, fontSize: 13, color: '#4D217A' }}>
              {new Date(item.whenIso).toLocaleString()}
            </AccessibilityText>
            <AccessibilityText style={{ marginTop: 2, fontSize: 12, color: '#4D217A' }}>
              {item.location ?? 'No location'}
            </AccessibilityText>
            <LargeButton
              label="Remove Event"
              onPress={() => deleteEvent(item.id)}
              style={{ marginTop: 10, backgroundColor: '#F6E600' }}
            />
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};