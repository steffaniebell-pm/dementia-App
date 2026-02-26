# CareCompanion Functional Requirements Blueprint (MVP v1)

## 0) Document Control

- Product: CareCompanion (working name)
- Version: 1.0
- Audience: Product owner, designers, mobile engineers, backend engineers, QA
- Platforms: iOS + Android (mobile-first)
- Build Tooling: Visual Studio Code

## 1) Scope and Delivery Strategy

This project is implemented as a **Phase 1 baseline** with:

- Mobile-first role routing (patient/caregiver)
- Patient Home V2 with Next Action CTA
- Medication action logging with offline outbox queue
- Caregiver adherence summary and escalation visibility (stubbed trigger path)
- Simplified calendar and routine modules
- Patient-only brain games + reward indicator

## 2) Requirements Traceability Matrix (MVP)

### Roles & Pairing

- FR-ROLE-01: Implemented in role provider + root navigator role routing.
- FR-ROLE-02: Implemented as local invite code workflow (UI + local repository stub).
- FR-ROLE-03: Implemented as dignity-control model in pairing state (view/edit mode setting).
- FR-ROLE-04: Deferred (Phase later): multi-caregiver permissions.

### Home Hub V2

- FR-HUB-01: Next card always rendered.
- FR-HUB-02: One-tap primary CTA from Next card.
- FR-HUB-03: Primary routine tiles implemented: Today, Meds, Games, Wellness, Nutrition.

### Medication Adherence

- FR-MED-01: Caregiver add/edit via local CRUD controls.
- FR-MED-02: Reminder content stub is included with minimal PHI utility.
- FR-MED-03: Patient actions Taken/Snooze/Skip with confirmation.
- FR-MED-04: Adherence summary visible in caregiver dashboard/reports.
- FR-NOTIF-02: Escalation rule path implemented as local pending-action evaluation stub.

### Calendar / Daily Structure

- FR-CAL-01: Caregiver event CRUD baseline (local repository).
- FR-CAL-02: Patient Today simplified list with next event priority.
- FR-CAL-03: Notification-ready event data fields and outbox sync events.

### Brain Games

- FR-GAME-01: Four categories provided.
- FR-GAME-02: Play Today auto-selects short session.
- FR-GAME-03: Positive reinforcement copy only.
- FR-GAME-04: Daily reward indicator included.

### Nutrition & Recipes

- FR-NUT-01: Tip of day + recipe of day shown.
- FR-NUT-02: Recipe detail uses short, easy steps.
- FR-NUT-03: Deferred (nice-to-have): persistent offline cache.

### Wellness

- FR-WELL-01: Exercise/Yoga/Cardio/Calm categories shown.
- FR-WELL-02: Session controls implemented: Start/Pause/Stop.
- FR-WELL-03: Completion logging baseline implemented.

## 3) Backend/Platform Gaps (Known)

These are intentionally stubbed in mobile and must be completed server-side:

- Server authorization checks for shared profile access
- Real push notification delivery
- Cloud sync conflict resolution and durable storage
- Audit log persistence beyond app memory

## 4) Suggested Next Iteration

1. Replace in-memory repositories with SQLite/Realm.
2. Add API-backed pairing, auth, and server enforcement.
3. Wire push notifications + escalation jobs.
4. Add QA test cases per FR acceptance criteria.
