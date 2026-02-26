import { readState, upsertState } from '../sqliteStore';
import { getAdherenceSummary, getMedications } from './medicationsRepo';
import { getCalendarItems, getNextUpcomingEvent } from './calendarRepo';
import { getPatientProfile, getPrimaryEmergencyContact } from './patientProfileRepo';
import { getGameRewardState } from './gamesRepo';

const STORAGE_KEY = 'reports.lastVisitSummary';

export type LocalVisitSummary = {
  exportedAtIso: string;
  text: string;
};

export const generateVisitSummaryText = (): LocalVisitSummary => {
  const exportedAtIso = new Date().toISOString();
  const profile = getPatientProfile();
  const emergency = getPrimaryEmergencyContact();
  const adherence = getAdherenceSummary();
  const meds = getMedications();
  const nextEvent = getNextUpcomingEvent();
  const totalEvents = getCalendarItems().length;
  const game = getGameRewardState();

  const text = [
    'CareCompanion Visit Summary (Local)',
    `Exported: ${exportedAtIso}`,
    '',
    `Patient: ${profile.displayName}`,
    `Language: ${profile.language}`,
    `Quiet Hours: ${profile.quietHours ? `${profile.quietHours.start}-${profile.quietHours.end}` : 'Off'}`,
    `Reminder Tone: ${profile.reminderTone ?? 'standard'}`,
    '',
    `Medication adherence: ${adherence.rate}% (${adherence.taken}/${adherence.total})`,
    `Medications configured: ${meds.length}`,
    `Brain games played today: ${game.playedToday ? 'Yes' : 'No'}`,
    '',
    `Calendar events total: ${totalEvents}`,
    `Next event: ${nextEvent ? nextEvent.title : 'None'}`,
    '',
    `Emergency contact: ${emergency ? `${emergency.name} (${emergency.phone})` : 'Not set'}`,
  ].join('\n');

  return {
    exportedAtIso,
    text,
  };
};

export const saveVisitSummaryLocal = (summary: LocalVisitSummary): void => {
  upsertState(STORAGE_KEY, JSON.stringify(summary));
};

export const getLastVisitSummaryLocal = (): LocalVisitSummary | null => {
  const raw = readState(STORAGE_KEY);
  if (!raw) {
    return null;
  }
  return JSON.parse(raw) as LocalVisitSummary;
};