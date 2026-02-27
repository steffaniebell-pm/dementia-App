import React from 'react';
import { SafeAreaView, View } from 'react-native';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';
import { AccessibilityText } from '../../components/common/AccessibilityText';
import { LargeButton } from '../../components/common/LargeButton';
import { InlineToast } from '../../components/common/InlineToast';
import { recordWellnessCompletion } from '../../data/db/repositories/wellnessRepo';
import { useInlineToast } from '../../hooks/useInlineToast';

export const WellnessSessionPlayerScreen = () => {
  const [state, setState] = React.useState<'idle' | 'running' | 'paused' | 'done'>('idle');
  const { toastMessage, showToast } = useInlineToast();

  const onStop = () => {
    setState('done');
    recordWellnessCompletion();
    showToast('Session complete. Great job!');
  };

  const statusTitle =
    state === 'idle' ? 'Ready' : state === 'running' ? 'In progress' : state === 'paused' ? 'Paused' : 'Completed';
  const statusText =
    state === 'idle'
      ? 'Ready when you are.'
      : state === 'running'
        ? 'Session in progress.'
        : state === 'paused'
          ? 'Paused. Resume when comfortable.'
          : 'Great job. Session complete.';
  const statusIcon = state === 'done' ? '✅' : state === 'paused' ? '⏸️' : state === 'running' ? '🟢' : '🌿';

  return (
    <SafeAreaView style={{ flex: 1, padding: 16, backgroundColor: '#B8CEDB' }}>
      <Header showBrand brandVariant="medical" title="Wellness session" subtitle="Stop anytime. Your comfort comes first." />

      <Card style={{ backgroundColor: '#B8CEDB' }}>
        <AccessibilityText style={{ fontSize: 14, color: '#4D217A' }}>Session</AccessibilityText>
        <AccessibilityText style={{ marginTop: 4, fontSize: 22, fontWeight: '700', color: '#4D217A' }}>
          Gentle wellness
        </AccessibilityText>
        <AccessibilityText style={{ marginTop: 6, fontSize: 14, color: '#4D217A' }}>{statusText}</AccessibilityText>
      </Card>

      <Card style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 16 }}>
        <AccessibilityText style={{ fontSize: 24, marginRight: 12 }}>{statusIcon}</AccessibilityText>
        <View style={{ flex: 1 }}>
          <AccessibilityText style={{ fontSize: 17, fontWeight: '600', color: '#4D217A' }}>{statusTitle}</AccessibilityText>
          <AccessibilityText style={{ marginTop: 2, fontSize: 13, color: '#4D217A' }}>{statusText}</AccessibilityText>
        </View>
      </Card>

      <AccessibilityText style={{ marginTop: 6, marginBottom: 10, fontSize: 20, fontWeight: '700', color: '#4D217A' }}>
        Controls
      </AccessibilityText>
      <LargeButton label="Start" onPress={() => setState('running')} />
      <LargeButton label="Pause" onPress={() => setState('paused')} />
      <LargeButton label="Stop" onPress={onStop} />
      <InlineToast message={toastMessage} />
    </SafeAreaView>
  );
};