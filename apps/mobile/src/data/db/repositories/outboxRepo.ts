import { OutboxEvent } from '../../../domain/models';

const outbox: OutboxEvent[] = [];

export const addOutboxEvent = (event: OutboxEvent): void => {
  if (event.idempotencyKey) {
    const exists = outbox.some((current) => current.idempotencyKey === event.idempotencyKey);
    if (exists) {
      return;
    }
  }
  outbox.push(event);
};

export const getOutboxEvents = (): OutboxEvent[] => outbox;

export const clearOutboxEvents = (): void => {
  outbox.splice(0, outbox.length);
};

export const removeOutboxEventsByIds = (ids: string[]): void => {
  const idSet = new Set(ids);
  for (let index = outbox.length - 1; index >= 0; index -= 1) {
    if (idSet.has(outbox[index].id)) {
      outbox.splice(index, 1);
    }
  }
};

export const getOutboxEscalationCandidates = (thresholdMinutes: number): OutboxEvent[] => {
  const nowMs = Date.now();
  return outbox.filter((event) => {
    if (event.type !== 'MED_ACTION') {
      return false;
    }
    const createdMs = new Date(event.createdAtIso).getTime();
    const ageMinutes = (nowMs - createdMs) / 60000;
    return ageMinutes >= thresholdMinutes;
  });
};

export const markOutboxRetried = (id: string): void => {
  const event = outbox.find((current) => current.id === id);
  if (!event) {
    return;
  }
  event.retryCount = (event.retryCount ?? 0) + 1;
  event.lastAttemptAtIso = new Date().toISOString();
};