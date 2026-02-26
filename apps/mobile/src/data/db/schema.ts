export type Migration = {
  version: number;
  description: string;
};

export const migrations: Migration[] = [
  {
    version: 1,
    description: 'create medications, calendar, and outbox collections',
  },
];