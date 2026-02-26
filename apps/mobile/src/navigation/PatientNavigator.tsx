import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeHubScreen } from '../screens/patient/HomeHubScreen';
import { TodayScreen } from '../screens/patient/TodayScreen';
import { MedNowScreen } from '../screens/patient/MedNowScreen';
import { MedListScreen } from '../screens/patient/MedListScreen';
import { BrainGamesScreen } from '../screens/patient/BrainGamesScreen';
import { WellnessScreen } from '../screens/patient/WellnessScreen';
import { NutritionScreen } from '../screens/patient/NutritionScreen';
import { RecipeDetailScreen } from '../screens/patient/RecipeDetailScreen';
import { CallCaregiverScreen } from '../screens/patient/CallCaregiverScreen';
import { EmergencyScreen } from '../screens/patient/EmergencyScreen';
import { GamePlayScreen } from '../screens/patient/GamePlayScreen';
import { WellnessSessionPlayerScreen } from '../screens/patient/WellnessSessionPlayerScreen';

export type PatientStackParamList = {
  HomeHub: undefined;
  Today: undefined;
  MedNow: undefined;
  MedList: undefined;
  BrainGames: undefined;
  GamePlay: undefined;
  Wellness: undefined;
  WellnessSessionPlayer: undefined;
  Nutrition: undefined;
  RecipeDetail: undefined;
  CallCaregiver: undefined;
  Emergency: undefined;
};

const Stack = createNativeStackNavigator<PatientStackParamList>();

export const PatientNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="HomeHub" component={HomeHubScreen} options={{ title: 'Home' }} />
      <Stack.Screen name="Today" component={TodayScreen} />
      <Stack.Screen name="MedNow" component={MedNowScreen} />
      <Stack.Screen name="MedList" component={MedListScreen} />
      <Stack.Screen name="BrainGames" component={BrainGamesScreen} />
      <Stack.Screen name="GamePlay" component={GamePlayScreen} options={{ title: 'Play Today' }} />
      <Stack.Screen name="Wellness" component={WellnessScreen} />
      <Stack.Screen
        name="WellnessSessionPlayer"
        component={WellnessSessionPlayerScreen}
        options={{ title: 'Session Player' }}
      />
      <Stack.Screen name="Nutrition" component={NutritionScreen} />
      <Stack.Screen name="RecipeDetail" component={RecipeDetailScreen} options={{ title: 'Recipe' }} />
      <Stack.Screen name="CallCaregiver" component={CallCaregiverScreen} />
      <Stack.Screen name="Emergency" component={EmergencyScreen} />
    </Stack.Navigator>
  );
};