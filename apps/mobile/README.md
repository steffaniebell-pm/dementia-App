# Dementia Mobile App

React Native + Expo baseline for the patient/caregiver dementia support app.

## Prerequisites

- Node.js 18+
- npm 9+
- Expo CLI (optional, `npx expo` works without global install)

## Quick Start

```bash
npm install
npm start
```

From `apps/mobile`, you can also run:

- `npm run android` — run on Android device/emulator
- `npm run ios` — run on iOS simulator (macOS only)
- `npm run web` — run in browser
- `npm run lint` — lint TypeScript files
- `npx tsc --noEmit` — type-check only

## QA Checklist

- Quick regression checklist: `QA.md`

## Handoff

- Session handoff summary: `HANDOFF_SUMMARY.md`

## No API Key Mode

This app supports a local development auth mode that does not require API keys.

- Auth mode: `local-no-key` (device session fallback)
- Role entry: continue as Patient or Caregiver from the local auth gate
- Local state persists via SQLite + app state storage

This mode is intended for UI/flow development only. Production still requires backend auth and server-side authorization.

## Demo Role Switch (Dev/Staging)

- Dev: enabled automatically in `__DEV__` builds.
- Staging: set `EXPO_PUBLIC_ENABLE_ROLE_DEMO_SWITCH=true` to show the subtle role chip on Patient/Caregiver home screens.
- Production: leave `EXPO_PUBLIC_ENABLE_ROLE_DEMO_SWITCH` unset (or `false`) to keep role switching locked to sign-in session.

Environment profile templates are included:

- `.env.staging` → `EXPO_PUBLIC_ENABLE_ROLE_DEMO_SWITCH=true`
- `.env.production` → `EXPO_PUBLIC_ENABLE_ROLE_DEMO_SWITCH=false`

Use a profile by copying it to `.env.local` before starting Expo.

PowerShell:

```powershell
Copy-Item .env.staging .env.local -Force
npm start
```

Production profile:

```powershell
Copy-Item .env.production .env.local -Force
npm start
```

## Project Structure

- `App.tsx` — app entry export
- `src/app/App.tsx` — root composition of providers and navigation
- `src/app/providers/*` — Theme/Auth/Role/DB providers
- `src/navigation/*` — root and role-specific navigators + deep linking
- `src/screens/patient/*` — patient-facing screens
- `src/screens/caregiver/*` — caregiver-facing screens
- `src/components/common/*` — shared UI components
- `src/components/patient/*` — patient-specific UI blocks
- `src/domain/*` — domain models and next-action logic
- `src/data/db/*` — local DB stubs, schema, repositories, seed
- `src/data/sync/*` — outbox + sync engine/API stubs
- `src/hooks/*` — app-level hooks (`useRole`, `useNextAction`)
- `src/theme/*` — tokens/colors/spacing/typography/accessibility
- `src/utils/*` — logger, time, uuid helpers

## Current Baseline Behavior

- Role-driven root routing (`patient` vs `caregiver`)
- SQLite-backed local persistence for medications, calendar, logs, pairing, and game reward state
- Next Action card computed from medication data
- Sync layer included as stub (`push/pull` placeholders)

## Caregiver MVP Flow (Simplified)

- Caregiver Home uses plain-language actions: `Medicines`, `Calendar`, `Reports`, `Settings`.
- Reports focuses on one primary action: `Copy Summary`.
- Visit summary is generated automatically when opening Reports and saved locally.
- Reports show `Last Summary` with a caregiver-friendly `Generated` timestamp.
- Settings keeps essential controls only: optional PIN, quiet hours presets, reminder tone, emergency contact, pairing, emergency info, and lock app.

## Shared UX Utilities

- `src/hooks/useInlineToast.ts`
	- Standardizes transient inline feedback messages with auto-dismiss timing.
- `src/hooks/useUndoWindow.ts`
	- Standardizes undo windows (default 5 seconds) and safe undo consumption.
- `src/utils/confirm.ts`
	- Standardizes destructive action confirmation dialogs (`confirmDestructiveAction`).

These utilities are currently used in caregiver management screens and selected patient action flows.

## Coding Conventions

- Keep patient UX simple: one primary goal per screen and minimal branching actions.
- Reuse shared utilities before adding screen-local logic:
	- `useInlineToast` for transient feedback
	- `useUndoWindow` for temporary undo flows
	- `confirmDestructiveAction` for destructive confirmations
- Persist durable state through repository + SQLite helpers (avoid direct DB usage in screens).
- Keep screens orchestration-focused; place business logic in repositories/hooks/domain modules.
- Prefer positive, supportive copy for patient-facing interactions.
- Run `npx tsc --noEmit` before handoff for each feature slice.

## Copy Style Guide

- Use plain, everyday words (for example: `Home`, `Medicines`, `Calendar`, `Settings`).
- Prefer short labels (1-3 words) for buttons and section titles.
- Keep one primary action per screen when possible.
- Use supportive, calm tone for patient text.
- Avoid technical terms in UI copy (for example: use `Generated` instead of raw field names).
- Keep phrasing consistent across patient and caregiver screens.

## Next Suggested Steps

1. Implement production authentication and secure server-side role authorization.
2. Connect `syncEngine` to real backend endpoints with conflict handling.
3. Add push notifications for medication and schedule reminders.
4. Add unit tests for `nextActionResolver` and repository edge cases.
5. Add accessibility audits (screen reader labels, contrast, touch targets).

## Recent Update (PR Summary)

- Added a dementia-friendly 2x2 jigsaw puzzle for the patient Brain Games Problem Solving flow.
- Problem Solving now opens category-specific gameplay with simple tap-to-swap tiles.
- Added gentle completion gating so Brain Star claim is enabled after puzzle completion.
- Kept non-problem-solving game categories on the existing gameplay experience.
- Validation completed with TypeScript check: `npx tsc --noEmit`.
