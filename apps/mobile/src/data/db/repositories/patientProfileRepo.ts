import { PatientProfileEntity } from '../../../domain/backendModels';
import { readState, upsertState } from '../sqliteStore';

const STORAGE_KEY = 'backend.patientProfile';

let profile: PatientProfileEntity = {
  id: 'default-patient',
  displayName: 'Patient Profile',
  language: 'en',
  accessibilitySettings: {
    fontScale: 1.3,
    contrast: 'high',
    audioPrompts: true,
  },
  emergencyInfo: {
    contacts: [],
    allergies: [],
  },
};

export const hydratePatientProfile = (): void => {
  const raw = readState(STORAGE_KEY);
  if (!raw) {
    return;
  }
  profile = JSON.parse(raw) as PatientProfileEntity;
};

export const getPatientProfile = (): PatientProfileEntity => profile;

export const upsertPatientProfile = (nextProfile: PatientProfileEntity): void => {
  profile = nextProfile;
  upsertState(STORAGE_KEY, JSON.stringify(profile));
};

export const setQuietHours = (quietHours: PatientProfileEntity['quietHours']): void => {
  profile = {
    ...profile,
    quietHours,
  };
  upsertState(STORAGE_KEY, JSON.stringify(profile));
};

export const setReminderTone = (reminderTone: 'soft' | 'standard'): void => {
  profile = {
    ...profile,
    reminderTone,
  };
  upsertState(STORAGE_KEY, JSON.stringify(profile));
};

export const getPrimaryEmergencyContact = (): { name: string; phone: string } | null => {
  const primary = profile.emergencyInfo.contacts[0];
  if (!primary) {
    return null;
  }

  const [name, phone] = primary.split('|');
  return {
    name: name ?? '',
    phone: phone ?? '',
  };
};

export const setPrimaryEmergencyContact = (name: string, phone: string): void => {
  const normalizedName = name.trim();
  const normalizedPhone = phone.trim();
  const encoded = `${normalizedName}|${normalizedPhone}`;

  const remaining = profile.emergencyInfo.contacts.slice(1);

  profile = {
    ...profile,
    emergencyInfo: {
      ...profile.emergencyInfo,
      contacts: [encoded, ...remaining],
    },
  };

  upsertState(STORAGE_KEY, JSON.stringify(profile));
};