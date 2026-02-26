import { OutboxEvent } from '../../domain/models';
import { addOutboxEvent, getOutboxEvents } from '../db/repositories/outboxRepo';
import { nowIso } from '../../utils/time';
import { createUuid } from '../../utils/uuid';

type EnqueueOutboxOptions = {
  resourceType?: string;
  patientId?: string;
  idempotencyKey?: string;
};

export const enqueueOutbox = (
  type: string,
  payload: Record<string, unknown>,
  options?: EnqueueOutboxOptions,
): OutboxEvent => {
  const event: OutboxEvent = {
    id: createUuid(),
    type,
    payload,
    createdAtIso: nowIso(),
    resourceType: options?.resourceType,
    patientId: options?.patientId,
    idempotencyKey: options?.idempotencyKey ?? createUuid(),
    retryCount: 0,
  };
  addOutboxEvent(event);
  return event;
};

export const readOutbox = (): OutboxEvent[] => getOutboxEvents();