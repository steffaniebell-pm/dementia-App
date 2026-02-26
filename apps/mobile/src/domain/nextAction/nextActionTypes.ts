export type NextActionType = 'take-med' | 'start-game' | 'drink-water' | 'none';

export type NextAction = {
  type: NextActionType;
  title: string;
  dueText: string;
  ctaLabel: string;
  targetScreen: 'MedNow' | 'BrainGames' | 'Today' | 'Wellness' | 'Nutrition';
};