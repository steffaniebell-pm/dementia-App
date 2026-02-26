import React, { createContext, useContext, useMemo, useState } from 'react';
import { UserRole } from '../../domain/models';
import {
  clearLocalPin,
  getLocalAuthState,
  hydrateLocalAuthState,
  setLocalPin,
  signInLocal,
  signOutLocal,
  verifyLocalPin,
} from '../../data/db/repositories/localAuthRepo';

type AuthContextValue = {
  isAuthenticated: boolean;
  currentRole: UserRole;
  signIn: (role?: UserRole) => void;
  signOut: () => void;
  authMode: 'local-no-key';
  hasPin: boolean;
  setPin: (pin: string) => void;
  removePin: () => void;
  unlockWithPin: (pin: string) => boolean;
};

const AuthContext = createContext<AuthContextValue>({
  isAuthenticated: true,
  currentRole: 'patient',
  signIn: () => undefined,
  signOut: () => undefined,
  authMode: 'local-no-key',
  hasPin: false,
  setPin: () => undefined,
  removePin: () => undefined,
  unlockWithPin: () => false,
});

export const AuthProvider = ({ children }: React.PropsWithChildren) => {
  const persisted = getLocalAuthState();
  const [isAuthenticated, setIsAuthenticated] = useState(persisted.isAuthenticated);
  const [currentRole, setCurrentRole] = useState<UserRole>(persisted.role);
  const [hasPin, setHasPin] = useState(Boolean(persisted.pin));

  React.useEffect(() => {
    try {
      hydrateLocalAuthState();
      const nextState = getLocalAuthState();
      setIsAuthenticated(nextState.isAuthenticated);
      setCurrentRole(nextState.role);
      setHasPin(Boolean(nextState.pin));
    } catch {
      setIsAuthenticated(true);
      setCurrentRole('patient');
      setHasPin(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated,
      currentRole,
      signIn: (role: UserRole = 'patient') => {
        signInLocal(role);
        setCurrentRole(role);
        setIsAuthenticated(true);
      },
      signOut: () => {
        signOutLocal();
        setIsAuthenticated(false);
      },
      authMode: 'local-no-key' as const,
      hasPin,
      setPin: (pin: string) => {
        setLocalPin(pin);
        setHasPin(true);
      },
      removePin: () => {
        clearLocalPin();
        setHasPin(false);
      },
      unlockWithPin: (pin: string) => {
        const ok = verifyLocalPin(pin);
        if (ok) {
          setCurrentRole(getLocalAuthState().role);
          setIsAuthenticated(true);
        }
        return ok;
      },
    }),
    [currentRole, hasPin, isAuthenticated],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);