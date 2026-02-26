import { GameCategory, GameRewardState } from '../../../domain/models';
import { readState, upsertState } from '../sqliteStore';

const categories: GameCategory[] = ['memory', 'speed', 'attention', 'problem-solving'];

let rewardState: GameRewardState = {
  playedToday: false,
  rewardText: 'Play today to earn your Brain Star ⭐',
  streakDays: 0,
  totalStars: 0,
  totalSessions: 0,
  milestoneText: undefined,
};

const getStreakMilestoneText = (streakDays: number): string | undefined => {
  if (streakDays === 30) {
    return '🏆 30-day champion! Your consistency is amazing.';
  }
  if (streakDays === 14) {
    return '🌟 14-day momentum! You are building a strong habit.';
  }
  if (streakDays === 7) {
    return '🎉 7-day streak! One full week of brain training.';
  }
  if (streakDays === 3) {
    return '👏 3-day streak! Great start—keep it going.';
  }

  return undefined;
};

const toDateKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getDayDelta = (left: Date, right: Date): number => {
  const leftMidnight = new Date(left.getFullYear(), left.getMonth(), left.getDate()).getTime();
  const rightMidnight = new Date(right.getFullYear(), right.getMonth(), right.getDate()).getTime();
  return Math.round((leftMidnight - rightMidnight) / (24 * 60 * 60 * 1000));
};

const isPlayedTodayByDate = (state: GameRewardState): boolean => {
  if (!state.lastPlayedIso) {
    return false;
  }

  const lastPlayed = new Date(state.lastPlayedIso);
  if (Number.isNaN(lastPlayed.getTime())) {
    return false;
  }

  return toDateKey(lastPlayed) === toDateKey(new Date());
};

const withDerivedDailyState = (state: GameRewardState): GameRewardState => {
  const playedToday = isPlayedTodayByDate(state);
  const streakDays = state.streakDays ?? 0;
  const totalStars = state.totalStars ?? 0;
  const totalSessions = state.totalSessions ?? 0;

  return {
    ...state,
    playedToday,
    streakDays,
    totalStars,
    totalSessions,
    milestoneText: playedToday ? state.milestoneText : undefined,
    rewardText: playedToday ? 'Brain Star earned today ⭐' : 'Play today to earn your Brain Star ⭐',
  };
};

const persistRewardState = (): void => {
  try {
    upsertState('games.rewardState', JSON.stringify(rewardState));
  } catch {
    // Fall back to memory-only state.
  }
};

export const getGameCategories = (): GameCategory[] => categories;

export const getGameRewardState = (): GameRewardState => {
  rewardState = withDerivedDailyState(rewardState);
  return rewardState;
};

export const completeDailyGame = (): GameRewardState => {
  const now = new Date();
  const current = getGameRewardState();
  const alreadyPlayedToday = current.playedToday;

  let nextStreakDays = current.streakDays ?? 0;
  if (!alreadyPlayedToday) {
    if (current.lastPlayedIso) {
      const lastPlayed = new Date(current.lastPlayedIso);
      const dayDelta = Number.isNaN(lastPlayed.getTime()) ? 999 : getDayDelta(now, lastPlayed);

      if (dayDelta === 1) {
        nextStreakDays += 1;
      } else if (dayDelta > 1) {
        nextStreakDays = 1;
      } else {
        nextStreakDays = Math.max(nextStreakDays, 1);
      }
    } else {
      nextStreakDays = 1;
    }
  }

  const milestoneText = alreadyPlayedToday ? current.milestoneText : getStreakMilestoneText(nextStreakDays);

  rewardState = {
    ...current,
    playedToday: true,
    rewardText: alreadyPlayedToday
      ? 'Session complete. Keep your streak strong 🔥'
      : milestoneText ?? 'Brain Star earned today ⭐',
    lastPlayedIso: now.toISOString(),
    streakDays: alreadyPlayedToday ? current.streakDays ?? 0 : nextStreakDays,
    totalStars: alreadyPlayedToday ? current.totalStars ?? 0 : (current.totalStars ?? 0) + 1,
    totalSessions: (current.totalSessions ?? 0) + 1,
    milestoneText,
  };

  persistRewardState();

  return rewardState;
};

export const hydrateGameRewardState = (): void => {
  try {
    const raw = readState('games.rewardState');
    if (raw) {
      rewardState = withDerivedDailyState(JSON.parse(raw) as GameRewardState);
    }
  } catch {
    // Keep default reward state on hydrate failure.
  }
};