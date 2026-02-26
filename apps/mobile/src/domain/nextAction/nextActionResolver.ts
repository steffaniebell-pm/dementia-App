import { NextAction } from './nextActionTypes';
import { CalendarItem, Medication } from '../models';

export const resolveNextAction = (
  medications: Medication[],
  upcomingEvents: CalendarItem[],
  playedGameToday: boolean,
): NextAction => {
  const nextMed = medications.find((medication) => medication.active);

  if (nextMed) {
    return {
      type: 'take-med',
      title: `Take ${nextMed.name}`,
      dueText: `Due at ${nextMed.scheduleTime}`,
      ctaLabel: 'Take Now',
      targetScreen: 'MedNow',
    };
  }

  if (!playedGameToday) {
    return {
      type: 'start-game',
      title: 'Play your short brain game',
      dueText: '1–3 minutes',
      ctaLabel: 'Start',
      targetScreen: 'BrainGames',
    };
  }

  const nextEvent = upcomingEvents[0];
  if (nextEvent) {
    return {
      type: 'none',
      title: nextEvent.title,
      dueText: 'Next in your schedule',
      ctaLabel: 'Open Today',
      targetScreen: 'Today',
    };
  }

  return {
    type: 'drink-water',
    title: 'Drink a glass of water',
    dueText: 'Any time this hour',
    ctaLabel: 'Open Wellness',
    targetScreen: 'Wellness',
  };
};