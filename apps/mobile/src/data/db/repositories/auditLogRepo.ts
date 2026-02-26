import { AuditLogEvent } from '../../../domain/backendModels';
import { nowIso } from '../../../utils/time';
import { createUuid } from '../../../utils/uuid';
import { readState, upsertState } from '../sqliteStore';

const STORAGE_KEY = 'backend.auditLogs';
const auditLogs: AuditLogEvent[] = [];

const persist = () => upsertState(STORAGE_KEY, JSON.stringify(auditLogs));

export const hydrateAuditLogs = (): void => {
  const raw = readState(STORAGE_KEY);
  if (!raw) {
    return;
  }
  const parsed = JSON.parse(raw) as AuditLogEvent[];
  auditLogs.splice(0, auditLogs.length, ...parsed);
};

export const appendAuditLog = (
  payload: Omit<AuditLogEvent, 'id' | 'timestampIso'>,
): AuditLogEvent => {
  const event: AuditLogEvent = {
    ...payload,
    id: createUuid(),
    timestampIso: nowIso(),
  };
  auditLogs.unshift(event);
  persist();
  return event;
};

export const getAuditLogs = (): AuditLogEvent[] => auditLogs;