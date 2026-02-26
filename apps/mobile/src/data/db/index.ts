import { Platform } from 'react-native';

type SQLiteDatabaseLike = {
  execSync: (sql: string) => void;
  runSync: (sql: string, ...params: unknown[]) => void;
  getFirstSync: <T>(sql: string, ...params: unknown[]) => T | null;
  getAllSync: <T>(sql: string, ...params: unknown[]) => T[];
};

export type LocalDb = {
  name: string;
  openedAtIso: string;
  sqlite: SQLiteDatabaseLike;
};

let sqliteConnection: SQLiteDatabaseLike | null = null;

export const getSqliteDb = (): SQLiteDatabaseLike => {
  if (!sqliteConnection) {
    if (Platform.OS === 'web') {
      throw new Error('SQLite is not enabled for web in this build.');
    }

    const moduleName = 'expo-sqlite';
    const dynamicRequire = new Function('name', 'return require(name);') as (name: string) => unknown;
    const sqliteModule = dynamicRequire(moduleName) as {
      openDatabaseSync: (name: string) => SQLiteDatabaseLike;
    };
    sqliteConnection = sqliteModule.openDatabaseSync('carecompanion.db');
  }
  return sqliteConnection;
};

export const openDb = (): LocalDb => {
  return {
    name: 'dementia-local-db',
    openedAtIso: new Date().toISOString(),
    sqlite: getSqliteDb(),
  };
};