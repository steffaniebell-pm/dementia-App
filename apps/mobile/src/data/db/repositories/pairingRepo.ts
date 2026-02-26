import { PairingInvite, SharedProfile } from '../../../domain/models';
import { createUuid } from '../../../utils/uuid';
import { readState, upsertState } from '../sqliteStore';

let latestInvite: PairingInvite | null = null;

let profile: SharedProfile = {
  patientId: createUuid(),
  patientDisplayName: 'Patient Profile',
  caregiverLinked: false,
  dignityAccess: 'view',
};

export const getSharedProfile = (): SharedProfile => profile;

const persistPairingState = (): void => {
  try {
    upsertState('pairing.profile', JSON.stringify(profile));
    upsertState('pairing.latestInvite', JSON.stringify(latestInvite));
  } catch {
    // Use in-memory fallback when SQLite is unavailable.
  }
};

export const createInviteCode = (
  patientDisplayName: string,
  dignityAccess: SharedProfile['dignityAccess'],
): PairingInvite => {
  const code = Math.random().toString(36).slice(2, 8).toUpperCase();
  const now = Date.now();

  latestInvite = {
    code,
    patientDisplayName,
    dignityAccess,
    createdAtIso: new Date(now).toISOString(),
    expiresAtIso: new Date(now + 15 * 60_000).toISOString(),
  };

  persistPairingState();

  return latestInvite;
};

export const acceptInviteCode = (code: string): { success: boolean; message: string } => {
  if (!latestInvite) {
    return { success: false, message: 'No invite code exists yet.' };
  }
  if (latestInvite.code !== code.trim().toUpperCase()) {
    return { success: false, message: 'Invite code is invalid.' };
  }
  if (Date.now() > new Date(latestInvite.expiresAtIso).getTime()) {
    return { success: false, message: 'Invite code expired. Generate a new code.' };
  }

  profile = {
    ...profile,
    patientDisplayName: latestInvite.patientDisplayName,
    caregiverLinked: true,
    dignityAccess: latestInvite.dignityAccess,
  };

  persistPairingState();

  return { success: true, message: 'Pairing successful.' };
};

export const setDignityAccess = (access: SharedProfile['dignityAccess']): void => {
  profile = {
    ...profile,
    dignityAccess: access,
  };

  persistPairingState();
};

export const hydratePairingState = (): void => {
  try {
    const profileJson = readState('pairing.profile');
    const inviteJson = readState('pairing.latestInvite');

    if (profileJson) {
      profile = JSON.parse(profileJson) as SharedProfile;
    }
    if (inviteJson) {
      latestInvite = JSON.parse(inviteJson) as PairingInvite | null;
    }
  } catch {
    // Keep in-memory defaults if hydration fails.
  }
};