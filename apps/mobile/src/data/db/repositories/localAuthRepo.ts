import { UserRole } from '../../../domain/models';
import { readState, upsertState } from '../sqliteStore';

const STORAGE_KEY = 'auth.localState';

type LocalAuthState = {
  mode: 'local-no-key';
  isAuthenticated: boolean;
  role: UserRole;
  pin?: string;
};

let state: LocalAuthState = {
  mode: 'local-no-key',
  isAuthenticated: true,
  role: 'patient',
};

const persist = () => {
  try {
    upsertState(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Keep in-memory auth state if persistence is unavailable (e.g., web init issues).
  }
};

export const hydrateLocalAuthState = () => {
  try {
    const raw = readState(STORAGE_KEY);
    if (!raw) {
      return;
    }

    state = JSON.parse(raw) as LocalAuthState;
  } catch {
    // Keep default in-memory state if persisted auth cannot be read.
  }
};

export const getLocalAuthState = (): LocalAuthState => state;

export const signInLocal = (role: UserRole): void => {
  state = {
    ...state,
    isAuthenticated: true,
    role,
  };
  persist();
};

export const signOutLocal = (): void => {
  state = {
    ...state,
    isAuthenticated: false,
  };
  persist();
};

export const setLocalPin = (pin: string): void => {
  state = {
    ...state,
    pin,
  };
  persist();
};

export const clearLocalPin = (): void => {
  state = {
    ...state,
    pin: undefined,
  };
  persist();
};

export const verifyLocalPin = (pin: string): boolean => {
  return state.pin === pin;
};