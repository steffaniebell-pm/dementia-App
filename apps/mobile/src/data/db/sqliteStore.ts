import { MedicationLog } from '../../domain/models';
import { getSqliteDb } from './index';

let schemaReady = false;

const ensureSchema = (): void => {
  if (schemaReady) {
    return;
  }

  const db = getSqliteDb();
  db.execSync(`
    CREATE TABLE IF NOT EXISTS app_state (
      key TEXT PRIMARY KEY NOT NULL,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS medication_logs (
      id TEXT PRIMARY KEY NOT NULL,
      medication_id TEXT NOT NULL,
      action TEXT NOT NULL,
      created_at_iso TEXT NOT NULL,
      sync_state TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS medications (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      dose TEXT NOT NULL,
      schedule_time TEXT NOT NULL,
      active INTEGER NOT NULL,
      instructions TEXT,
      start_date_iso TEXT,
      end_date_iso TEXT
    );

    CREATE TABLE IF NOT EXISTS calendar_items (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      when_iso TEXT NOT NULL,
      type TEXT NOT NULL,
      location TEXT,
      notes TEXT,
      color TEXT,
      reminder_minutes_before INTEGER
    );
  `);

  schemaReady = true;
};

export const upsertState = (key: string, value: string): void => {
  ensureSchema();
  const db = getSqliteDb();
  db.runSync(
    'INSERT INTO app_state (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value=excluded.value',
    key,
    value,
  );
};

export const readState = (key: string): string | null => {
  ensureSchema();
  const db = getSqliteDb();
  const row = db.getFirstSync<{ value: string }>('SELECT value FROM app_state WHERE key = ?', key);
  return row?.value ?? null;
};

export const upsertMedicationLog = (entry: MedicationLog): void => {
  ensureSchema();
  const db = getSqliteDb();
  db.runSync(
    `
      INSERT INTO medication_logs (id, medication_id, action, created_at_iso, sync_state)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        medication_id = excluded.medication_id,
        action = excluded.action,
        created_at_iso = excluded.created_at_iso,
        sync_state = excluded.sync_state
    `,
    entry.id,
    entry.medicationId,
    entry.action,
    entry.createdAtIso,
    entry.syncState,
  );
};

export const readMedicationLogs = (): MedicationLog[] => {
  ensureSchema();
  const db = getSqliteDb();
  const rows = db.getAllSync<{
    id: string;
    medication_id: string;
    action: MedicationLog['action'];
    created_at_iso: string;
    sync_state: MedicationLog['syncState'];
  }>('SELECT id, medication_id, action, created_at_iso, sync_state FROM medication_logs ORDER BY created_at_iso DESC');

  return rows.map((row) => ({
    id: row.id,
    medicationId: row.medication_id,
    action: row.action,
    createdAtIso: row.created_at_iso,
    syncState: row.sync_state,
  }));
};

export const initializeSqliteStore = (): void => {
  ensureSchema();
};

export type PersistedMedication = {
  id: string;
  name: string;
  dose: string;
  scheduleTime: string;
  active: boolean;
  instructions?: string;
  startDateIso?: string;
  endDateIso?: string;
};

export const upsertMedication = (entry: PersistedMedication): void => {
  ensureSchema();
  const db = getSqliteDb();
  db.runSync(
    `
      INSERT INTO medications (id, name, dose, schedule_time, active, instructions, start_date_iso, end_date_iso)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        dose = excluded.dose,
        schedule_time = excluded.schedule_time,
        active = excluded.active,
        instructions = excluded.instructions,
        start_date_iso = excluded.start_date_iso,
        end_date_iso = excluded.end_date_iso
    `,
    entry.id,
    entry.name,
    entry.dose,
    entry.scheduleTime,
    entry.active ? 1 : 0,
    entry.instructions ?? null,
    entry.startDateIso ?? null,
    entry.endDateIso ?? null,
  );
};

export const readMedications = (): PersistedMedication[] => {
  ensureSchema();
  const db = getSqliteDb();
  const rows = db.getAllSync<{
    id: string;
    name: string;
    dose: string;
    schedule_time: string;
    active: number;
    instructions: string | null;
    start_date_iso: string | null;
    end_date_iso: string | null;
  }>(
    'SELECT id, name, dose, schedule_time, active, instructions, start_date_iso, end_date_iso FROM medications',
  );

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    dose: row.dose,
    scheduleTime: row.schedule_time,
    active: row.active === 1,
    instructions: row.instructions ?? undefined,
    startDateIso: row.start_date_iso ?? undefined,
    endDateIso: row.end_date_iso ?? undefined,
  }));
};

export type PersistedCalendarItem = {
  id: string;
  title: string;
  whenIso: string;
  type: 'appointment' | 'reminder' | 'activity';
  location?: string;
  notes?: string;
  color?: string;
  reminderMinutesBefore?: number;
};

export const upsertCalendarItem = (entry: PersistedCalendarItem): void => {
  ensureSchema();
  const db = getSqliteDb();
  db.runSync(
    `
      INSERT INTO calendar_items (
        id, title, when_iso, type, location, notes, color, reminder_minutes_before
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        title = excluded.title,
        when_iso = excluded.when_iso,
        type = excluded.type,
        location = excluded.location,
        notes = excluded.notes,
        color = excluded.color,
        reminder_minutes_before = excluded.reminder_minutes_before
    `,
    entry.id,
    entry.title,
    entry.whenIso,
    entry.type,
    entry.location ?? null,
    entry.notes ?? null,
    entry.color ?? null,
    entry.reminderMinutesBefore ?? null,
  );
};

export const readCalendarItems = (): PersistedCalendarItem[] => {
  ensureSchema();
  const db = getSqliteDb();
  const rows = db.getAllSync<{
    id: string;
    title: string;
    when_iso: string;
    type: PersistedCalendarItem['type'];
    location: string | null;
    notes: string | null;
    color: string | null;
    reminder_minutes_before: number | null;
  }>(
    `
      SELECT id, title, when_iso, type, location, notes, color, reminder_minutes_before
      FROM calendar_items
      ORDER BY when_iso ASC
    `,
  );

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    whenIso: row.when_iso,
    type: row.type,
    location: row.location ?? undefined,
    notes: row.notes ?? undefined,
    color: row.color ?? undefined,
    reminderMinutesBefore: row.reminder_minutes_before ?? undefined,
  }));
};

export const deleteMedicationById = (id: string): void => {
  ensureSchema();
  const db = getSqliteDb();
  db.runSync('DELETE FROM medications WHERE id = ?', id);
};

export const clearAllMedications = (): void => {
  ensureSchema();
  const db = getSqliteDb();
  db.runSync('DELETE FROM medications');
};

export const deleteCalendarItemById = (id: string): void => {
  ensureSchema();
  const db = getSqliteDb();
  db.runSync('DELETE FROM calendar_items WHERE id = ?', id);
};

export const clearAllCalendarItems = (): void => {
  ensureSchema();
  const db = getSqliteDb();
  db.runSync('DELETE FROM calendar_items');
};