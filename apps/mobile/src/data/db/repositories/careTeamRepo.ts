import { CareTeamMember, PermissionLevel } from '../../../domain/backendModels';
import { readState, upsertState } from '../sqliteStore';

const STORAGE_KEY = 'backend.careTeam';
const members: CareTeamMember[] = [];

const persist = () => upsertState(STORAGE_KEY, JSON.stringify(members));

export const hydrateCareTeam = (): void => {
  const raw = readState(STORAGE_KEY);
  if (!raw) {
    return;
  }
  const parsed = JSON.parse(raw) as CareTeamMember[];
  members.splice(0, members.length, ...parsed);
};

export const getCareTeam = (): CareTeamMember[] => members;

export const upsertCareTeamMember = (patientId: string, caregiverUserId: string, permissionLevel: PermissionLevel) => {
  const index = members.findIndex(
    (member) => member.patientId === patientId && member.caregiverUserId === caregiverUserId,
  );
  const nextMember: CareTeamMember = {
    patientId,
    caregiverUserId,
    permissionLevel,
  };

  if (index >= 0) {
    members[index] = nextMember;
  } else {
    members.push(nextMember);
  }
  persist();
};