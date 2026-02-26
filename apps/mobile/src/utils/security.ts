import { CareTeamMember } from '../domain/backendModels';

export const redactPushPayload = (payload: Record<string, unknown>): Record<string, unknown> => {
  if (payload.type === 'MEDICATION_REMINDER') {
    return { type: 'MEDICATION_REMINDER', message: 'Medication time' };
  }
  return payload;
};

export const canAccessPatientResource = (
  patientId: string,
  caregiverUserId: string,
  team: CareTeamMember[],
): boolean => {
  return team.some((member) => member.patientId === patientId && member.caregiverUserId === caregiverUserId);
};

export const canEditPatientResource = (
  patientId: string,
  caregiverUserId: string,
  team: CareTeamMember[],
): boolean => {
  return team.some(
    (member) =>
      member.patientId === patientId &&
      member.caregiverUserId === caregiverUserId &&
      member.permissionLevel === 'admin',
  );
};