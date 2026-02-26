import { WellnessSession } from '../../../domain/models';

const sessions: WellnessSession[] = [
  { id: 'well-1', title: 'Gentle Stretch', category: 'exercise', durationMinutes: 5 },
  { id: 'well-2', title: 'Morning Yoga Flow', category: 'yoga', durationMinutes: 8 },
  { id: 'well-3', title: 'Light Cardio Walk', category: 'cardio', durationMinutes: 7 },
  { id: 'well-4', title: 'Calm Breathing', category: 'calm', durationMinutes: 4 },
];

let completedToday = 0;

export const getWellnessSessions = (): WellnessSession[] => sessions;

export const recordWellnessCompletion = (): void => {
  completedToday += 1;
};

export const getWellnessCompletedToday = (): number => completedToday;