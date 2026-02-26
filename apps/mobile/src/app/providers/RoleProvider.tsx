import React, { createContext, useContext, useMemo, useState } from 'react';
import { UserRole } from '../../domain/models';

type RoleContextValue = {
  role: UserRole;
  setRole: (role: UserRole) => void;
  toggleRole: () => void;
};

const RoleContext = createContext<RoleContextValue>({
  role: 'patient',
  setRole: () => undefined,
  toggleRole: () => undefined,
});

export const RoleProvider = ({ children }: React.PropsWithChildren) => {
  const [role, setRole] = useState<UserRole>('patient');

  const value = useMemo(
    () => ({
      role,
      setRole,
      toggleRole: () => setRole((current) => (current === 'patient' ? 'caregiver' : 'patient')),
    }),
    [role],
  );

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
};

export const useRoleContext = () => useContext(RoleContext);