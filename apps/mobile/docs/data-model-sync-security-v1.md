# CareCompanion Next Build: Data Model, Sync, and Security Baseline

## Data Model (Backend-Ready)

Implemented backend-oriented entities in `src/domain/backendModels.ts`:

- User (`AppUser`)
- Patient Profile (`PatientProfileEntity`)
- Care Team (`CareTeamMember`)
- Medication + schedule + event log (`MedicationEntity`, `MedicationScheduleOccurrence`, `MedicationLogEvent`)
- Calendar Event (`CalendarEventEntity`)
- Brain Game Session (`BrainGameSession`)
- Wellness Session Log (`WellnessSessionLog`)
- Nutrition View Log (`NutritionViewLog`)
- Audit Log (`AuditLogEvent`)

## Event-Log & Reliability

- Medication logs include actor/timestamp/idempotency fields in `src/domain/models.ts` and `medicationsRepo.ts`.
- Outbox supports `idempotencyKey`, `retryCount`, and `lastAttemptAtIso`.
- Outbox deduplicates events by idempotency key before enqueue.
- Sync engine tracks retries and keeps pending events for future retries.

## Offline-First Strategy

- Critical records continue to use local persistence (`sqliteStore` + repository hydration in `seed.ts`).
- Added repository hydration for backend-ready entities:
  - users, patient profile, care team
  - audit logs, brain game sessions, wellness logs, nutrition view logs

## Security & HIPAA-Like Baseline

- Added security utilities in `src/utils/security.ts`:
  - PHI-safe push payload redaction
  - server-style access check helpers for paired caregivers
- API client applies payload redaction for outbound sync payload stubs.

## API-Key-Free Development Alternative

Implemented local auth fallback for environments without API keys:

- `local-no-key` mode in auth provider/repository
- device session entry as Patient or Caregiver
- persisted local auth state for iterative development

This keeps development unblocked while preserving a clean seam for future backend auth integration.

## Current Boundary

This is a mobile baseline and not a substitute for backend enforcement.
Production rollout still requires:

- Server-side authorization checks on every patient resource
- Real auth provider integration (+ optional MFA)
- Encrypted backend storage + key management
- durable outbox persistence + replay guarantees across reinstalls