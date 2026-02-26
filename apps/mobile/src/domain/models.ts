export type UserRole = 'patient' | 'caregiver';

export type DignityAccess = 'view' | 'edit';

export type MedicationAction = 'taken' | 'snooze' | 'skip';

export type GameCategory = 'memory' | 'speed' | 'attention' | 'problem-solving';

export type WellnessCategory = 'exercise' | 'yoga' | 'cardio' | 'calm';

export type Medication = {
  id: string;
  name: string;
  dose: string;
  scheduleTime: string;
  active: boolean;
  instructions?: string;
  startDateIso?: string;
  endDateIso?: string;
};

export type MedicationLog = {
  id: string;
  medicationId: string;
  action: MedicationAction;
  createdAtIso: string;
  syncState: 'pending' | 'synced';
  patientId?: string;
  dueAtIso?: string;
  timestampIso?: string;
  snoozeMinutes?: number;
  skipReason?: string;
  actor?: 'patient' | 'caregiver';
  idempotencyKey?: string;
};

export type CalendarItem = {
  id: string;
  title: string;
  whenIso: string;
  type: 'appointment' | 'reminder' | 'activity';
  location?: string;
  notes?: string;
  color?: string;
  reminderMinutesBefore?: number;
};

export type PairingInvite = {
  code: string;
  patientDisplayName: string;
  createdAtIso: string;
  expiresAtIso: string;
  dignityAccess: DignityAccess;
};

export type SharedProfile = {
  patientId: string;
  patientDisplayName: string;
  caregiverLinked: boolean;
  dignityAccess: DignityAccess;
};

export type GameRewardState = {
  playedToday: boolean;
  rewardText: string;
  lastPlayedIso?: string;
  streakDays?: number;
  totalStars?: number;
  totalSessions?: number;
  milestoneText?: string;
};

export type NutritionRecipe = {
  id: string;
  title: string;
  tag?: string;
  ingredients: string[];
  steps: string[];
};

export type WellnessSession = {
  id: string;
  title: string;
  category: WellnessCategory;
  durationMinutes: number;
};

export type OutboxEvent = {
  id: string;
  type: string;
  payload: Record<string, unknown>;
  createdAtIso: string;
  idempotencyKey?: string;
  resourceType?: string;
  patientId?: string;
  retryCount?: number;
  lastAttemptAtIso?: string;
};