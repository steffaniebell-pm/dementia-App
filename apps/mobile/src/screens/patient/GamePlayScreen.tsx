import React from 'react';
import { SafeAreaView, TouchableOpacity, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';
import { AccessibilityText } from '../../components/common/AccessibilityText';
import { LargeButton } from '../../components/common/LargeButton';
import { InlineToast } from '../../components/common/InlineToast';
import { completeDailyGame, getGameRewardState } from '../../data/db/repositories/gamesRepo';
import { useInlineToast } from '../../hooks/useInlineToast';
import { PatientStackParamList } from '../../navigation/PatientNavigator';

type Props = NativeStackScreenProps<PatientStackParamList, 'GamePlay'>;

const puzzleTiles = [
  { icon: '🌳', label: 'Tree' },
  { icon: '🏡', label: 'Home' },
  { icon: '🌼', label: 'Flower' },
  { icon: '🐦', label: 'Bird' },
];

const solvedOrder = [0, 1, 2, 3];

const createStartingOrder = () => {
  const shuffled = [...solvedOrder].sort(() => Math.random() - 0.5);
  const isSolved = shuffled.every((value, index) => value === solvedOrder[index]);
  return isSolved ? [1, 0, 2, 3] : shuffled;
};

export const GamePlayScreen = ({ route }: Props) => {
  const selectedCategory = route.params.category;
  const isProblemSolvingGame = selectedCategory === 'problem-solving';
  const initialRewardState = getGameRewardState();
  const [rewardText, setRewardText] = React.useState(initialRewardState.rewardText);
  const [milestoneText, setMilestoneText] = React.useState<string | undefined>(initialRewardState.milestoneText);
  const [summaryText, setSummaryText] = React.useState(
    `Streak: ${initialRewardState.streakDays ?? 0} day${(initialRewardState.streakDays ?? 0) === 1 ? '' : 's'} • Stars: ${initialRewardState.totalStars ?? 0}`,
  );
  const [isCompleted, setIsCompleted] = React.useState(false);
  const [tileOrder, setTileOrder] = React.useState<number[]>(createStartingOrder());
  const [selectedTilePosition, setSelectedTilePosition] = React.useState<number | null>(null);
  const [moveCount, setMoveCount] = React.useState(0);
  const { toastMessage, showToast } = useInlineToast();

  const puzzleSolved = tileOrder.every((value, index) => value === solvedOrder[index]);

  const gameTitle = isProblemSolvingGame ? 'Jigsaw puzzle' : 'Brain game';
  const gameSubtitle = isProblemSolvingGame
    ? 'Tap one tile, then another to swap. Rebuild the picture.'
    : isCompleted
      ? 'Session complete. Nice work today.'
      : 'Short session started. Keep going at your pace.';

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

  const onPuzzleTilePress = (position: number) => {
    if (puzzleSolved) {
      return;
    }

    if (selectedTilePosition === null) {
      setSelectedTilePosition(position);
      return;
    }

    if (selectedTilePosition === position) {
      setSelectedTilePosition(null);
      return;
    }

    const nextOrder = [...tileOrder];
    const firstTile = nextOrder[selectedTilePosition];
    nextOrder[selectedTilePosition] = nextOrder[position];
    nextOrder[position] = firstTile;
    setTileOrder(nextOrder);
    setSelectedTilePosition(null);
    setMoveCount((current) => current + 1);
  };

  const resetPuzzle = () => {
    setTileOrder(createStartingOrder());
    setSelectedTilePosition(null);
    setMoveCount(0);
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 16, backgroundColor: '#FFFFFF' }}>
      <Header showBrand brandVariant="medical" title="Play today" subtitle="Great focus today" />

      <Card style={{ backgroundColor: '#FFFFFF' }}>
        <AccessibilityText style={{ fontSize: 14, color: '#4D217A' }}>Session</AccessibilityText>
        <AccessibilityText style={{ marginTop: 4, fontSize: 22, fontWeight: '700', color: '#4D217A' }}>
          {gameTitle}
        </AccessibilityText>
        <AccessibilityText style={{ marginTop: 6, fontSize: 14, color: '#4D217A' }}>{gameSubtitle}</AccessibilityText>
      </Card>

      {isProblemSolvingGame ? (
        <Card style={{ paddingVertical: 12 }}>
          <AccessibilityText style={{ fontSize: 14, color: '#4D217A' }}>Dementia-friendly puzzle</AccessibilityText>
          <AccessibilityText style={{ marginTop: 4, fontSize: 15, color: '#4D217A' }}>
            {puzzleSolved
              ? `Puzzle complete in ${moveCount} move${moveCount === 1 ? '' : 's'} 🎉`
              : 'Tap one tile, then another tile, to swap positions.'}
          </AccessibilityText>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 14 }}>
            {tileOrder.map((tileIndex, position) => {
              const tile = puzzleTiles[tileIndex];
              const isSelected = selectedTilePosition === position;

              return (
                <TouchableOpacity
                  key={`${tile.label}-${position}`}
                  accessibilityRole="button"
                  accessibilityLabel={`${tile.label} puzzle piece`}
                  onPress={() => onPuzzleTilePress(position)}
                  style={{
                    width: '48%',
                    minHeight: 110,
                    borderRadius: 12,
                    borderWidth: 2,
                    borderColor: isSelected ? '#8A00E5' : '#B8CEDB',
                    backgroundColor: isSelected ? '#B8CEDB' : '#B8CEDB',
                    marginBottom: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingVertical: 12,
                  }}
                >
                  <AccessibilityText style={{ fontSize: 36 }}>{tile.icon}</AccessibilityText>
                  <AccessibilityText style={{ marginTop: 6, fontSize: 13, color: '#4D217A' }}>{tile.label}</AccessibilityText>
                </TouchableOpacity>
              );
            })}
          </View>

          <LargeButton label="Shuffle Puzzle" onPress={resetPuzzle} style={{ marginBottom: 0 }} />
        </Card>
      ) : (
        <Card style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 16 }}>
          <AccessibilityText style={{ fontSize: 24, marginRight: 12 }}>{isCompleted ? '✅' : '🎮'}</AccessibilityText>
          <View style={{ flex: 1 }}>
            <AccessibilityText style={{ fontSize: 17, fontWeight: '600', color: '#4D217A' }}>
              {isCompleted ? 'Completed' : 'In progress'}
            </AccessibilityText>
            <AccessibilityText style={{ marginTop: 2, fontSize: 13, color: '#4D217A' }}>
              {isCompleted ? 'Your points are saved.' : 'Finish when you are ready.'}
            </AccessibilityText>
          </View>
        </Card>
      )}

      <Card style={{ backgroundColor: '#FFFFFF' }}>
        <AccessibilityText style={{ fontSize: 14, color: '#009999' }}>Your momentum</AccessibilityText>
        <AccessibilityText style={{ marginTop: 4, fontSize: 16, color: '#009999', fontWeight: '600' }}>{summaryText}</AccessibilityText>
      </Card>

      <LargeButton
        label={isCompleted ? 'Play Another Round' : 'Finish Session & Claim Star'}
        onPress={completeSession}
        disabled={isProblemSolvingGame && !puzzleSolved}
      />
      <InlineToast message={toastMessage} />

      <Card>
        <AccessibilityText style={{ fontSize: 16, color: '#4D217A' }}>{rewardText}</AccessibilityText>
      </Card>

      {isCompleted && milestoneText ? (
        <Card style={{ backgroundColor: '#F6E600' }}>
          <AccessibilityText style={{ fontSize: 14, color: '#4D217A', fontWeight: '700' }}>Streak Milestone</AccessibilityText>
          <AccessibilityText style={{ marginTop: 4, fontSize: 14, color: '#4D217A' }}>{milestoneText}</AccessibilityText>
        </Card>
      ) : null}
    </SafeAreaView>
  );
};