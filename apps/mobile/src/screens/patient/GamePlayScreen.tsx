import React from 'react';
import { SafeAreaView, View } from 'react-native';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';
import { AccessibilityText } from '../../components/common/AccessibilityText';
import { LargeButton } from '../../components/common/LargeButton';
import { InlineToast } from '../../components/common/InlineToast';
import { completeDailyGame, getGameRewardState } from '../../data/db/repositories/gamesRepo';
import { useInlineToast } from '../../hooks/useInlineToast';

export const GamePlayScreen = () => {
  const initialRewardState = getGameRewardState();
  const [rewardText, setRewardText] = React.useState(initialRewardState.rewardText);
  const [milestoneText, setMilestoneText] = React.useState<string | undefined>(initialRewardState.milestoneText);
  const [summaryText, setSummaryText] = React.useState(
    `Streak: ${initialRewardState.streakDays ?? 0} day${(initialRewardState.streakDays ?? 0) === 1 ? '' : 's'} • Stars: ${initialRewardState.totalStars ?? 0}`,
  );
  const [isCompleted, setIsCompleted] = React.useState(false);
  const { toastMessage, showToast } = useInlineToast();

  const completeSession = () => {
    const reward = completeDailyGame();
    setRewardText(reward.rewardText);
    setMilestoneText(reward.milestoneText);
    setSummaryText(
      `Streak: ${reward.streakDays ?? 0} day${(reward.streakDays ?? 0) === 1 ? '' : 's'} • Stars: ${reward.totalStars ?? 0} • Sessions: ${reward.totalSessions ?? 0}`,
    );
    setIsCompleted(true);
    showToast(reward.milestoneText ?? 'Great job! Brain Star earned today ⭐');
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 16, backgroundColor: '#F9FAFB' }}>
      <Header showBrand brandVariant="medical" title="Play today" subtitle="Great focus today" />

      <Card style={{ backgroundColor: '#EEF2FF' }}>
        <AccessibilityText style={{ fontSize: 14, color: '#4B5563' }}>Session</AccessibilityText>
        <AccessibilityText style={{ marginTop: 4, fontSize: 22, fontWeight: '700', color: '#111827' }}>
          Brain game
        </AccessibilityText>
        <AccessibilityText style={{ marginTop: 6, fontSize: 14, color: '#374151' }}>
          {isCompleted ? 'Session complete. Nice work today.' : 'Short session started. Keep going at your pace.'}
        </AccessibilityText>
      </Card>

      <Card style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 16 }}>
        <AccessibilityText style={{ fontSize: 24, marginRight: 12 }}>{isCompleted ? '✅' : '🎮'}</AccessibilityText>
        <View style={{ flex: 1 }}>
          <AccessibilityText style={{ fontSize: 17, fontWeight: '600', color: '#111827' }}>
            {isCompleted ? 'Completed' : 'In progress'}
          </AccessibilityText>
          <AccessibilityText style={{ marginTop: 2, fontSize: 13, color: '#374151' }}>
            {isCompleted ? 'Your points are saved.' : 'Finish when you are ready.'}
          </AccessibilityText>
        </View>
      </Card>

      <Card style={{ backgroundColor: '#ECFEFF' }}>
        <AccessibilityText style={{ fontSize: 14, color: '#0F766E' }}>Your momentum</AccessibilityText>
        <AccessibilityText style={{ marginTop: 4, fontSize: 16, color: '#134E4A', fontWeight: '600' }}>{summaryText}</AccessibilityText>
      </Card>

      <LargeButton label={isCompleted ? 'Play Another Round' : 'Finish Session & Claim Star'} onPress={completeSession} />
      <InlineToast message={toastMessage} />

      <Card>
        <AccessibilityText style={{ fontSize: 16, color: '#111827' }}>{rewardText}</AccessibilityText>
      </Card>

      {isCompleted && milestoneText ? (
        <Card style={{ backgroundColor: '#FEF3C7' }}>
          <AccessibilityText style={{ fontSize: 14, color: '#78350F', fontWeight: '700' }}>Streak Milestone</AccessibilityText>
          <AccessibilityText style={{ marginTop: 4, fontSize: 14, color: '#92400E' }}>{milestoneText}</AccessibilityText>
        </Card>
      ) : null}
    </SafeAreaView>
  );
};