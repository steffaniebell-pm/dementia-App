import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { openDb, type LocalDb } from '../../data/db';
import { seedDb } from '../../data/db/seed';

type DbContextValue = {
  db: LocalDb | null;
  ready: boolean;
};

const DbContext = createContext<DbContextValue>({
  db: null,
  ready: false,
});

export const DbProvider = ({ children }: React.PropsWithChildren) => {
  const [db, setDb] = useState<LocalDb | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const connection = openDb();
      seedDb(connection);
      setDb(connection);
    } catch (error) {
      console.warn('DB initialization failed. Continuing without DB connection.', error);
      setDb(null);
    } finally {
      setReady(true);
    }
  }, []);

  const value = useMemo(
    () => ({
      db,
      ready,
    }),
    [db, ready],
  );

  return <DbContext.Provider value={value}>{children}</DbContext.Provider>;
};

export const useDb = () => useContext(DbContext);