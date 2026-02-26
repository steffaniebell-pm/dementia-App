import React from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import { Header } from '../../components/common/Header';
import { Card } from '../../components/common/Card';
import { AccessibilityText } from '../../components/common/AccessibilityText';
import { getRecipeOfTheDay } from '../../data/db/repositories/nutritionRepo';

export const RecipeDetailScreen = () => {
  const recipe = getRecipeOfTheDay();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 24 }}>
        <Header showBrand brandVariant="medical" title="Today's recipe" subtitle={recipe.title} />

        <Card style={{ backgroundColor: '#EEF2FF' }}>
          <AccessibilityText style={{ fontSize: 14, color: '#4B5563' }}>Recipe</AccessibilityText>
          <AccessibilityText style={{ marginTop: 4, fontSize: 22, fontWeight: '700', color: '#111827' }}>
            {recipe.title}
          </AccessibilityText>
        </Card>

        <AccessibilityText style={{ marginTop: 6, marginBottom: 10, fontSize: 20, fontWeight: '700', color: '#111827' }}>
          What you need
        </AccessibilityText>
        <Card>
          {recipe.ingredients.map((ingredient) => (
            <View
              key={ingredient}
              style={{
                flexDirection: 'row',
                alignItems: 'flex-start',
                paddingVertical: 8,
                borderBottomWidth: 1,
                borderBottomColor: '#F3F4F6',
              }}
            >
              <AccessibilityText style={{ marginRight: 8, color: '#4F46E5' }}>•</AccessibilityText>
              <AccessibilityText style={{ flex: 1, fontSize: 14, color: '#374151' }}>{ingredient}</AccessibilityText>
            </View>
          ))}
        </Card>

        <AccessibilityText style={{ marginTop: 6, marginBottom: 10, fontSize: 20, fontWeight: '700', color: '#111827' }}>
          How to make it
        </AccessibilityText>
        <Card>
          {recipe.steps.map((step, index) => (
            <View
              key={step}
              style={{
                flexDirection: 'row',
                alignItems: 'flex-start',
                paddingVertical: 8,
                borderBottomWidth: 1,
                borderBottomColor: '#F3F4F6',
              }}
            >
              <AccessibilityText style={{ marginRight: 8, fontWeight: '700', color: '#4F46E5' }}>{`${index + 1}.`}</AccessibilityText>
              <AccessibilityText style={{ flex: 1, fontSize: 14, color: '#374151' }}>{step}</AccessibilityText>
            </View>
          ))}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};