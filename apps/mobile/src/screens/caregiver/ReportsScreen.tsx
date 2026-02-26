import React from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';
import { AccessibilityText } from '../../components/common/AccessibilityText';
import { LargeButton } from '../../components/common/LargeButton';
import { InlineToast } from '../../components/common/InlineToast';
import { useInlineToast } from '../../hooks/useInlineToast';
import { getAdherenceSummary } from '../../data/db/repositories/medicationsRepo';
import { getGameRewardState } from '../../data/db/repositories/gamesRepo';
import {
  generateVisitSummaryText,
  getLastVisitSummaryLocal,
  saveVisitSummaryLocal,
} from '../../data/db/repositories/reportExportRepo';

export const ReportsScreen = () => {
  const [refreshTick, setRefreshTick] = React.useState(0);
  const { toastMessage, showToast } = useInlineToast();
  const adherence = getAdherenceSummary();
  const game = getGameRewardState();
  const lastSummary = React.useMemo(() => getLastVisitSummaryLocal(), [refreshTick]);

  React.useEffect(() => {
    if (lastSummary) {
      return;
    }

    const summary = generateVisitSummaryText();
    saveVisitSummaryLocal(summary);
    setRefreshTick((current) => current + 1);
  }, [lastSummary]);

  const onCopySummary = async () => {
    const summary = lastSummary ?? generateVisitSummaryText();

    if (!lastSummary) {
      saveVisitSummaryLocal(summary);
      setRefreshTick((current) => current + 1);
    }

    await Clipboard.setStringAsync(summary.text);
    showToast('Summary copied to clipboard.');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 24 }}>
        <Header showBrand brandVariant="spark" title="Reports" subtitle="Summary for doctor visit" />
        <Card style={{ backgroundColor: '#EEF2FF' }}>
          <AccessibilityText style={{ fontSize: 14, color: '#4B5563' }}>Overview</AccessibilityText>
          <AccessibilityText style={{ marginTop: 4, fontSize: 22, fontWeight: '700', color: '#111827' }}>
            Visit summary
          </AccessibilityText>
          <AccessibilityText style={{ marginTop: 6, fontSize: 14, color: '#374151' }}>
            Generate and copy a concise update for appointments.
          </AccessibilityText>
        </Card>
        <Card>
          <AccessibilityText style={{ fontWeight: '700' }}>Medication adherence</AccessibilityText>
          <AccessibilityText>{`${adherence.rate}% taken (${adherence.taken}/${adherence.total})`}</AccessibilityText>
        </Card>
        <Card>
          <AccessibilityText style={{ fontWeight: '700' }}>Brain games played today</AccessibilityText>
          <AccessibilityText>{game.playedToday ? 'Yes' : 'No'}</AccessibilityText>
        </Card>
        <LargeButton label="Copy Summary" onPress={() => void onCopySummary()} />
        <InlineToast message={toastMessage} />
        {lastSummary ? (
          <Card>
            <AccessibilityText style={{ fontWeight: '700' }}>Last Summary</AccessibilityText>
            <AccessibilityText style={{ marginTop: 4 }}>{`Generated: ${new Date(lastSummary.exportedAtIso).toLocaleString()}`}</AccessibilityText>
            <AccessibilityText style={{ marginTop: 8 }}>{lastSummary.text}</AccessibilityText>
          </Card>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};