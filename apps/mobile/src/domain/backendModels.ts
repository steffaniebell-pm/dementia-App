export type PermissionLevel = 'admin' | 'viewer';

export type AppUser = {
  id: string;
  role: 'patient' | 'caregiver';
  email?: string;
  phone?: string;
  authProviderId?: string;
  createdAtIso: string;
};

export type AccessibilitySettings = {
  fontScale: number;
  contrast: 'default' | 'high';
  audioPrompts: boolean;
};

export type EmergencyInfo = {
  contacts: string[];
  allergies: string[];
  physician?: string;
  pharmacy?: string;
  instructions?: string;
};

export type PatientProfileEntity = {
  id: string;
  displayName: string;
  language: string;
  reminderTone?: 'soft' | 'standard';
  accessibilitySettings: AccessibilitySettings;
  quietHours?: {
    start: string;
    end: string;
  };
  emergencyInfo: EmergencyInfo;
};

export type CareTeamMember = {
  patientId: string;
  caregiverUserId: string;
  permissionLevel: PermissionLevel;
};

export type MedicationScheduleRules = {
  times: string[];
  days: string[];
  startDateIso?: string;
  endDateIso?: string;
};

export type MedicationEntity = {
  id: string;
  patientId: string;
  name: string;
  dose: string;
  instructions?: string;
  icons?: string[];
  scheduleRules: MedicationScheduleRules;
  createdBy: string;
  updatedBy: string;
};

export type MedicationScheduleOccurrence = {
  id: string;
  medicationId: string;
  dueAtIso: string;
};

export type MedicationLogEvent = {
  id: string;
  patientId: string;
  medicationId: string;
  dueAtIso: string;
  action: 'taken' | 'snooze' | 'skip';
  timestampIso: string;
  snoozeMinutes?: number;
  skipReason?: string;
  actor: 'patient' | 'caregiver';
  syncStatus: 'pending' | 'synced' | 'failed';
  idempotencyKey: string;
};

export type CalendarEventEntity = {
  id: string;
  patientId: string;
  title: string;
  startAtIso: string;
  endAtIso?: string;
  location?: string;
  notes?: string;
  category: string;
  color?: string;
  reminders: number[];
};

export type BrainGameSession = {
  id: string;
  patientId: string;
  category: 'memory' | 'speed' | 'attention' | 'problem-solving';
  gameType: string;
  startedAtIso: string;
  endedAtIso?: string;
  completed: boolean;
  rewardGranted: boolean;
};

export type WellnessSessionLog = {
  id: string;
  patientId: string;
  sessionType: 'exercise' | 'yoga' | 'cardio' | 'calm';
  programId: string;
  startedAtIso: string;
  endedAtIso?: string;
  completed: boolean;
};

export type NutritionViewLog = {
  recipeId: string;
  patientId: string;
  viewedAtIso: string;
};

export type AuditLogEvent = {
  id: string;
  patientId: string;
  actorUserId: string;
  actionType: 'med_changed' | 'event_changed' | 'emergency_updated';
  timestampIso: string;
  metadata: Record<string, unknown>;
};