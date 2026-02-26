import { readOutbox } from './outbox';
import { apiClient } from './apiClient';
import {
  removeOutboxEventsByIds,
  getOutboxEscalationCandidates,
  markOutboxRetried,
} from '../db/repositories/outboxRepo';
import { logger } from '../../utils/logger';
import { markMedicationLogsSynced } from '../db/repositories/medicationsRepo';

export const runSync = async (): Promise<void> => {
  const events = readOutbox();
  if (events.length === 0) {
    return;
  }
  events.forEach((event) => markOutboxRetried(event.id));
  const response = await apiClient.push(events);
  if (response.ok) {
    const syncedLogIds = events
      .filter((event) => event.type === 'MED_ACTION')
      .map((event) => String(event.payload.medicationLogId ?? ''))
      .filter((id) => id.length > 0);

    if (syncedLogIds.length > 0) {
      markMedicationLogsSynced(syncedLogIds);
    }

    removeOutboxEventsByIds(events.map((event) => event.id));
  } else {
    logger.warn('Sync push failed, will retry later.');
  }
};

export const getEscalationEvents = (thresholdMinutes: number) => {
  const escalationCandidates = getOutboxEscalationCandidates(thresholdMinutes);
  if (escalationCandidates.length > 0) {
    logger.warn('Escalation candidates found', escalationCandidates.length);
  }
  return escalationCandidates;
};