import { WellnessSessionLog } from '../../../domain/backendModels';
import { nowIso } from '../../../utils/time';
import { createUuid } from '../../../utils/uuid';
import { readState, upsertState } from '../sqliteStore';

const STORAGE_KEY = 'backend.wellnessSessionLogs';
const sessions: WellnessSessionLog[] = [];

const persist = () => upsertState(STORAGE_KEY, JSON.stringify(sessions));

export const hydrateWellnessSessionLogs = (): void => {
  const raw = readState(STORAGE_KEY);
  if (!raw) {
    return;
  }
  const parsed = JSON.parse(raw) as WellnessSessionLog[];
  sessions.splice(0, sessions.length, ...parsed);
};

export const startWellnessSessionLog = (
  patientId: string,
  sessionType: WellnessSessionLog['sessionType'],
  programId: string,
): WellnessSessionLog => {
  const session: WellnessSessionLog = {
    id: createUuid(),
    patientId,
    sessionType,
    programId,
    startedAtIso: nowIso(),
    completed: false,
  };
  sessions.unshift(session);
  persist();
  return session;
};

export const completeWellnessSessionLog = (id: string): void => {
  const session = sessions.find((current) => current.id === id);
  if (!session) {
    return;
  }
  session.endedAtIso = nowIso();
  session.completed = true;
  persist();
};