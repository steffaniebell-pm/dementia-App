import { CalendarItem } from '../../../domain/models';
import {
  clearAllCalendarItems,
  deleteCalendarItemById,
  readCalendarItems,
  upsertCalendarItem as persistCalendarItem,
} from '../sqliteStore';

const items: CalendarItem[] = [
  {
    id: 'cal-1',
    title: 'Morning Walk',
    whenIso: new Date().toISOString(),
    type: 'activity',
    color: '#2563EB',
    reminderMinutesBefore: 15,
  },
];

export const getCalendarItems = (): CalendarItem[] => items;

export const getTodayCalendarItems = (): CalendarItem[] => {
  return [...items].sort((a, b) => a.whenIso.localeCompare(b.whenIso));
};

export const getNextUpcomingEvent = (): CalendarItem | undefined => {
  return getTodayCalendarItems()[0];
};

export const upsertCalendarItem = (item: CalendarItem): void => {
  const index = items.findIndex((current) => current.id === item.id);
  if (index >= 0) {
    items[index] = item;
  } else {
    items.push(item);
  }

  try {
    persistCalendarItem(item);
  } catch {
    // Fall back to in-memory only if SQLite write fails.
  }
};

export const hydrateCalendarItems = (): void => {
  try {
    const persisted = readCalendarItems();
    if (persisted.length > 0) {
      items.splice(0, items.length, ...persisted);
      return;
    }

    items.forEach((item) => {
      persistCalendarItem(item);
    });
  } catch {
    // Keep default in-memory calendar data on persistence failure.
  }
};

export const removeCalendarItem = (id: string): void => {
  const index = items.findIndex((current) => current.id === id);
  if (index >= 0) {
    items.splice(index, 1);
  }

  try {
    deleteCalendarItemById(id);
  } catch {
    // Keep in-memory delete even if persistence delete fails.
  }
};

export const removeAllCalendarItems = (): void => {
  items.splice(0, items.length);

  try {
    clearAllCalendarItems();
  } catch {
    // Keep in-memory clear if persistence clear fails.
  }
};