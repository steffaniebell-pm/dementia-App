import { Medication, MedicationAction, MedicationLog } from '../../../domain/models';
import { createUuid } from '../../../utils/uuid';
import { nowIso } from '../../../utils/time';
import {
  clearAllMedications,
  deleteMedicationById,
  readMedicationLogs,
  readMedications,
  upsertMedication as persistMedication,
  upsertMedicationLog,
} from '../sqliteStore';

export type MedicationDoseStatus = 'planned' | 'taken' | 'missed';

const medications: Medication[] = [
  {
    id: 'med-1',
    name: 'Donepezil',
    dose: '10 mg',
    scheduleTime: '08:00 AM',
    active: true,
  },
  {
    id: 'med-2',
    name: 'Vitamin D',
    dose: '1 tablet',
    scheduleTime: '12:00 PM',
    active: true,
  },
  {
    id: 'med-3',
    name: 'Acetaminophen',
    dose: '500 mg',
    scheduleTime: '06:00 PM',
    active: true,
    instructions: 'Take with water after food if needed for pain.',
  },
  {
    id: 'med-4',
    name: 'Aspirin',
    dose: '81 mg',
    scheduleTime: '09:00 AM',
    active: true,
    instructions: 'Low-dose daily support as directed by clinician.',
  },
  {
    id: 'med-5',
    name: 'Cetirizine',
    dose: '10 mg',
    scheduleTime: '08:00 PM',
    active: true,
    instructions: 'Once daily for seasonal allergies.',
  },
];

const logs: MedicationLog[] = [];
const doseStatusOverrides: Record<string, { dateKey: string; status: 'planned' | 'taken' }> = {};

const toDateKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const parseScheduleTimeToToday = (scheduleTime: string, now: Date): Date | null => {
  const match = scheduleTime.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) {
    return null;
  }

  const rawHour = Number(match[1]);
  const minutes = Number(match[2]);
  const period = match[3].toUpperCase();
  let hour24 = rawHour % 12;

  if (period === 'PM') {
    hour24 += 12;
  }

  const due = new Date(now);
  due.setHours(hour24, minutes, 0, 0);
  return due;
};

const hasTakenToday = (medicationId: string, now: Date): boolean => {
  const todayKey = toDateKey(now);
  return logs.some((entry) => {
    if (entry.medicationId !== medicationId || entry.action !== 'taken') {
      return false;
    }

    const createdAt = new Date(entry.createdAtIso);
    return toDateKey(createdAt) === todayKey;
  });
};

const isPastDueNow = (scheduleTime: string, now: Date): boolean => {
  const dueTime = parseScheduleTimeToToday(scheduleTime, now);
  if (!dueTime) {
    return false;
  }

  return now.getTime() > dueTime.getTime();
};

export const getMedications = (): Medication[] => medications;

export const getDueMedication = (): Medication | undefined => {
  return medications.find((medication) => medication.active);
};

export const logMedicationAction = (
  medicationId: string,
  action: MedicationAction,
  syncState: 'pending' | 'synced' = 'pending',
): MedicationLog => {
  const timestampIso = nowIso();
  const entry: MedicationLog = {
    id: createUuid(),
    medicationId,
    action,
    createdAtIso: timestampIso,
    timestampIso,
    dueAtIso: timestampIso,
    actor: 'patient',
    idempotencyKey: createUuid(),
    syncState,
  };
  logs.unshift(entry);

  try {
    upsertMedicationLog(entry);
  } catch {
    // Fall back to in-memory only if SQLite is not ready.
  }

  return entry;
};

export const getMedicationLogs = (): MedicationLog[] => logs;

export const getMedicationDoseStatus = (medication: Medication, now: Date = new Date()): MedicationDoseStatus => {
  const todayKey = toDateKey(now);
  const override = doseStatusOverrides[medication.id];
  const hasTodayOverride = override && override.dateKey === todayKey;

  if (hasTodayOverride && override.status === 'taken') {
    return 'taken';
  }

  if (hasTodayOverride && override.status === 'planned') {
    return isPastDueNow(medication.scheduleTime, now) ? 'missed' : 'planned';
  }

  if (hasTakenToday(medication.id, now)) {
    return 'taken';
  }

  return isPastDueNow(medication.scheduleTime, now) ? 'missed' : 'planned';
};

export const setMedicationDoseStatus = (medication: Medication, status: 'planned' | 'taken'): void => {
  const now = new Date();
  doseStatusOverrides[medication.id] = {
    dateKey: toDateKey(now),
    status,
  };

  if (status === 'taken' && !hasTakenToday(medication.id, now)) {
    logMedicationAction(medication.id, 'taken', 'pending');
  }
};

export const getAdherenceSummary = () => {
  const last7 = logs.slice(0, 50);
  const taken = last7.filter((entry) => entry.action === 'taken').length;
  const total = Math.max(last7.length, 1);
  const rate = Math.round((taken / total) * 100);

  return {
    taken,
    total,
    rate,
    pendingEscalations: last7.filter((entry) => entry.action !== 'taken').length,
  };
};

export const markMedicationLogsSynced = (ids: string[]): void => {
  logs.forEach((entry) => {
    if (ids.includes(entry.id)) {
      entry.syncState = 'synced';
      try {
        upsertMedicationLog(entry);
      } catch {
        // Ignore persistence errors during sync mark.
      }
    }
  });
};

export const hydrateMedicationLogs = (): void => {
  try {
    const persisted = readMedicationLogs();
    logs.splice(0, logs.length, ...persisted);
  } catch {
    // Keep default in-memory state if SQLite read fails.
  }
};

export const upsertMedication = (medication: Medication): void => {
  const index = medications.findIndex((current) => current.id === medication.id);
  if (index >= 0) {
    medications[index] = medication;
  } else {
    medications.push(medication);
  }

  try {
    persistMedication(medication);
  } catch {
    // Continue with in-memory update if SQLite write fails.
  }
};

export const hydrateMedications = (): void => {
  try {
    const persisted = readMedications();
    if (persisted.length > 0) {
      medications.splice(0, medications.length, ...persisted);
      return;
    }

    medications.forEach((medication) => {
      persistMedication(medication);
    });
  } catch {
    // Keep default in-memory medications when SQLite is unavailable.
  }
};

export const removeMedication = (id: string): void => {
  const index = medications.findIndex((current) => current.id === id);
  if (index >= 0) {
    medications.splice(index, 1);
  }

  try {
    deleteMedicationById(id);
  } catch {
    // Keep in-memory delete even if persistence delete fails.
  }
};

export const removeAllMedications = (): void => {
  medications.splice(0, medications.length);

  try {
    clearAllMedications();
  } catch {
    // Keep in-memory clear if persistence clear fails.
  }
};