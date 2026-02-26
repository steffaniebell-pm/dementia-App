import { LinkingOptions } from '@react-navigation/native';
import { PatientStackParamList } from './PatientNavigator';

export const linking: LinkingOptions<PatientStackParamList> = {
  prefixes: ['dementiaapp://'],
  config: {
    screens: {
      HomeHub: 'home',
      Today: 'today',
      MedNow: 'med-now',
      MedList: 'med-list',
      BrainGames: 'brain-games',
      GamePlay: 'game-play',
      Wellness: 'wellness',
      WellnessSessionPlayer: 'wellness-player',
      Nutrition: 'nutrition',
      RecipeDetail: 'recipe',
      CallCaregiver: 'call-caregiver',
      Emergency: 'emergency',
    },
  },
};