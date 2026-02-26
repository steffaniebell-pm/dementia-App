import { BrainGameSession } from '../../../domain/backendModels';
import { nowIso } from '../../../utils/time';
import { createUuid } from '../../../utils/uuid';
import { readState, upsertState } from '../sqliteStore';

const STORAGE_KEY = 'backend.brainGameSessions';
const sessions: BrainGameSession[] = [];

const persist = () => upsertState(STORAGE_KEY, JSON.stringify(sessions));

export const hydrateBrainGameSessions = (): void => {
  const raw = readState(STORAGE_KEY);
  if (!raw) {
    return;
  }
  const parsed = JSON.parse(raw) as BrainGameSession[];
  sessions.splice(0, sessions.length, ...parsed);
};

export const startBrainGameSession = (patientId: string, category: BrainGameSession['category'], gameType: string) => {
  const session: BrainGameSession = {
    id: createUuid(),
    patientId,
    category,
    gameType,
    startedAtIso: nowIso(),
    completed: false,
    rewardGranted: false,
  };
  sessions.unshift(session);
  persist();
  return session;
};

export const completeBrainGameSession = (id: string, rewardGranted: boolean): void => {
  const session = sessions.find((current) => current.id === id);
  if (!session) {
    return;
  }
  session.endedAtIso = nowIso();
  session.completed = true;
  session.rewardGranted = rewardGranted;
  persist();
};