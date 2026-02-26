import React from 'react';
import { SafeAreaView, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Header } from '../../components/common/Header';
import { PatientStackParamList } from '../../navigation/PatientNavigator';
import { Card } from '../../components/common/Card';
import { AccessibilityText } from '../../components/common/AccessibilityText';
import { LargeButton } from '../../components/common/LargeButton';
import { getDailyNutritionTip, getRecipeOfTheDay } from '../../data/db/repositories/nutritionRepo';

type Props = NativeStackScreenProps<PatientStackParamList, 'Nutrition'>;

export const NutritionScreen = ({ navigation }: Props) => {
  const tip = getDailyNutritionTip();
  const recipe = getRecipeOfTheDay();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 24 }}>
        <Header showBrand brandVariant="medical" title="Nutrition" subtitle="Food and water" />

        <Card style={{ backgroundColor: '#EEF2FF' }}>
          <AccessibilityText style={{ fontSize: 14, color: '#4B5563' }}>Today</AccessibilityText>
          <AccessibilityText style={{ marginTop: 4, fontSize: 22, fontWeight: '700', color: '#111827' }}>
            Healthy choices
          </AccessibilityText>
          <AccessibilityText style={{ marginTop: 6, fontSize: 14, color: '#374151' }}>
            Small meals and steady hydration can support energy and focus.
          </AccessibilityText>
        </Card>

        <AccessibilityText style={{ marginTop: 6, marginBottom: 10, fontSize: 20, fontWeight: '700', color: '#111827' }}>
          Today's tip
        </AccessibilityText>
        <Card style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 16 }}>
          <AccessibilityText style={{ fontSize: 24, marginRight: 12 }}>💧</AccessibilityText>
          <AccessibilityText style={{ flex: 1, fontSize: 14, color: '#374151' }}>{tip}</AccessibilityText>
        </Card>

        <AccessibilityText style={{ marginTop: 6, marginBottom: 10, fontSize: 20, fontWeight: '700', color: '#111827' }}>
          Today's recipe
        </AccessibilityText>
        <Card style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 16 }}>
          <AccessibilityText style={{ fontSize: 24, marginRight: 12 }}>🥗</AccessibilityText>
          <AccessibilityText style={{ flex: 1, fontSize: 17, fontWeight: '600', color: '#111827' }}>{recipe.title}</AccessibilityText>
        </Card>

        <LargeButton label="Open recipe" onPress={() => navigation.navigate('RecipeDetail')} />
      </ScrollView>
    </SafeAreaView>
  );
};