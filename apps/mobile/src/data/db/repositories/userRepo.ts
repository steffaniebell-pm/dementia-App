import { AppUser } from '../../../domain/backendModels';
import { nowIso } from '../../../utils/time';
import { createUuid } from '../../../utils/uuid';
import { readState, upsertState } from '../sqliteStore';

const STORAGE_KEY = 'backend.users';
const users: AppUser[] = [];

const persist = () => upsertState(STORAGE_KEY, JSON.stringify(users));

export const hydrateUsers = (): void => {
  const raw = readState(STORAGE_KEY);
  if (!raw) {
    return;
  }
  const parsed = JSON.parse(raw) as AppUser[];
  users.splice(0, users.length, ...parsed);
};

export const getUsers = (): AppUser[] => users;

export const createUser = (input: Omit<AppUser, 'id' | 'createdAtIso'>): AppUser => {
  const user: AppUser = {
    ...input,
    id: createUuid(),
    createdAtIso: nowIso(),
  };
  users.push(user);
  persist();
  return user;
};