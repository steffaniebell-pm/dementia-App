import { useMemo } from 'react';
import { resolveNextAction } from '../domain/nextAction/nextActionResolver';
import { getMedications } from '../data/db/repositories/medicationsRepo';
import { getTodayCalendarItems } from '../data/db/repositories/calendarRepo';
import { getGameRewardState } from '../data/db/repositories/gamesRepo';

export const useNextAction = () => {
  return useMemo(() => {
    const medications = getMedications();
    const schedule = getTodayCalendarItems();
    const rewardState = getGameRewardState();
    return resolveNextAction(medications, schedule, rewardState.playedToday);
  }, []);
};