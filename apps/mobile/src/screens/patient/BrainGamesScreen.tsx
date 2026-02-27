import React from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Header } from '../../components/common/Header';
import { PatientStackParamList } from '../../navigation/PatientNavigator';
import { Card } from '../../components/common/Card';
import { AccessibilityText } from '../../components/common/AccessibilityText';
import { LargeButton } from '../../components/common/LargeButton';
import { getGameCategories, getGameRewardState } from '../../data/db/repositories/gamesRepo';

type Props = NativeStackScreenProps<PatientStackParamList, 'BrainGames'>;

export const BrainGamesScreen = ({ navigation }: Props) => {
  const categories = getGameCategories();
  const rewardState = getGameRewardState();
  const streakDays = rewardState.streakDays ?? 0;
  const totalStars = rewardState.totalStars ?? 0;
  const totalSessions = rewardState.totalSessions ?? 0;
  const dailyGoalText = rewardState.playedToday ? 'Daily goal complete ✅' : 'Daily goal: play 1 game';

  const toLabel = (category: string) => category.replace('-', ' ').replace(/\b\w/g, (char) => char.toUpperCase());

  const categoryIcon = (category: string) => {
    if (category === 'memory') {
      return '🧠';
    }
    if (category === 'speed') {
      return '⚡';
    }
    if (category === 'attention') {
      return '🎯';
    }
    return '🧩';
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#B8CEDB' }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 24 }}>
        <Header showBrand brandVariant="medical" title="Games" subtitle="Fun brain activity" />

        <Card style={{ backgroundColor: '#B8CEDB' }}>
          <AccessibilityText style={{ fontSize: 14, color: '#4D217A' }}>Today</AccessibilityText>
          <AccessibilityText style={{ marginTop: 4, fontSize: 22, fontWeight: '700', color: '#4D217A' }}>
            Keep your mind active
          </AccessibilityText>
          <AccessibilityText style={{ marginTop: 6, fontSize: 14, color: '#4D217A' }}>{dailyGoalText}</AccessibilityText>
          <AccessibilityText style={{ marginTop: 4, fontSize: 13, color: '#4D217A' }}>{rewardState.rewardText}</AccessibilityText>
        </Card>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <Card style={{ width: '48%', paddingVertical: 14 }}>
            <AccessibilityText style={{ fontSize: 12, color: '#4D217A' }}>Streak</AccessibilityText>
            <AccessibilityText style={{ marginTop: 4, fontSize: 20, fontWeight: '700', color: '#4D217A' }}>{`${streakDays} day${streakDays === 1 ? '' : 's'} 🔥`}</AccessibilityText>
          </Card>
          <Card style={{ width: '48%', paddingVertical: 14 }}>
            <AccessibilityText style={{ fontSize: 12, color: '#4D217A' }}>Brain Stars</AccessibilityText>
            <AccessibilityText style={{ marginTop: 4, fontSize: 20, fontWeight: '700', color: '#4D217A' }}>{`${totalStars} ⭐`}</AccessibilityText>
          </Card>
        </View>

        <Card style={{ paddingVertical: 14 }}>
          <AccessibilityText style={{ fontSize: 12, color: '#4D217A' }}>Total sessions completed</AccessibilityText>
          <AccessibilityText style={{ marginTop: 4, fontSize: 20, fontWeight: '700', color: '#4D217A' }}>{`${totalSessions}`}</AccessibilityText>
        </Card>

        {rewardState.milestoneText ? (
          <Card style={{ backgroundColor: '#F6E600' }}>
            <AccessibilityText style={{ fontSize: 13, color: '#4D217A', fontWeight: '700' }}>Milestone Unlocked</AccessibilityText>
            <AccessibilityText style={{ marginTop: 4, fontSize: 14, color: '#4D217A' }}>{rewardState.milestoneText}</AccessibilityText>
          </Card>
        ) : null}

        <AccessibilityText style={{ marginTop: 6, marginBottom: 10, fontSize: 20, fontWeight: '700', color: '#4D217A' }}>
          Game types
        </AccessibilityText>

        {categories.map((category) => (
          <Card key={category} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 16 }}>
            <AccessibilityText style={{ fontSize: 24, marginRight: 12 }}>{categoryIcon(category)}</AccessibilityText>
            <View style={{ flex: 1 }}>
              <AccessibilityText style={{ fontSize: 17, fontWeight: '600', color: '#4D217A' }}>{toLabel(category)}</AccessibilityText>
              <AccessibilityText style={{ marginTop: 2, fontSize: 13, color: '#4D217A' }}>Tap to start a short session</AccessibilityText>
            </View>
            <LargeButton
              label="Start"
              onPress={() => navigation.navigate('GamePlay', { category })}
              style={{ marginBottom: 0, paddingVertical: 10, paddingHorizontal: 14 }}
            />
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};