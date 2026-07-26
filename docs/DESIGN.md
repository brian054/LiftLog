# LiftLog — Technical Design Document

**Status:** Living document  
**Last updated:** 2026-07-14  
**Audience:** Solo developer (Brian); future contributors

This document describes the target architecture for LiftLog: an **offline-first Progressive Web App** that replaces a paper workout journal. It incorporates the **current repository state** and identifies what to keep, refactor, or build new.

---

## Product overview

LiftLog lets one user create **reusable workout templates**, **schedule them on a weekly calendar**, **log workouts quickly** (weight, reps, sets), and **see whether planned workouts were completed**.

The app must remain **fast and usable with poor or no internet**. User actions save to **IndexedDB immediately** and synchronize with the ASP.NET API when connectivity is available.

### Replaces

A paper journal: planned workouts for the week, checkmarks for completion, and logged sets/reps/weights.

### Explicit non-goals (MVP)

Do not include in initial implementation:

- Advanced charts or analytics
- AI-generated workouts
- Nutrition tracking
- Social features
- Multiple-user collaboration
- Wearable integrations
- Complex recurring schedules
- Native mobile applications
- Real-time multi-device editing
- Microservices

### Relationship to current README

The root `README.md` still mentions cardio, yoga, nutrition, and broad multi-platform goals. **This design doc supersedes that product scope for MVP.** Update README product goals when implementation begins.

---

## Current repository assessment

### What exists today (as-built)

| Layer | State |
|-------|--------|
| **Frontend** | React 19 + TypeScript + Vite 7; 5 components; no routing, no PWA, no IndexedDB |
| **Backend** | ASP.NET Core 10 + EF Core + PostgreSQL; 3 controllers; inline DTOs |
| **Data** | 3 tables: `Workouts`, `Exercises`, `WorkoutSingleExercises` |
| **Dev** | Docker Postgres, `npm run dev`, cross-platform scripts |
| **Tests** | None |

### What can remain (conceptually)

| Current asset | Maps to target |
|---------------|----------------|
| `Workout` model + UI | **Workout template** (rename/clarify in code later) |
| `Exercise` model + create UI | **Exercise catalog** (extend with archive, edit) |
| `WorkoutSingleExercise` | **Template exercise line** (sets, reps, sort order) |
| ASP.NET + EF + Postgres stack | **Server source of truth** for sync |
| `docker-compose.yml`, dev scripts | **Local dev** (unchanged role) |
| React + Vite + TypeScript | **PWA shell** (extend with Dexie, SW) |

### What should be refactored

| Item | Issue | Target change |
|------|--------|---------------|
| `Workout` naming | Ambiguous (template vs session) | Rename to `WorkoutTemplate` or document alias; add `WorkoutSession` |
| Integer `Id` PKs | Cannot create offline-first records safely | Add **client UUID** (`Guid` or string) on all syncable entities |
| Direct `fetch()` in components | No offline layer | **Repository pattern** → Dexie first, sync second |
| Hardcoded `http://localhost:5198` | Breaks prod/PWA | `VITE_API_BASE_URL` + env config |
| `WorkoutSingleExerciseController` | GET/DELETE hit wrong table; class/file name mismatch | Fix or replace with template-line endpoints |
| Raw EF entities in API responses | JSON cycles, over-fetching | **Response DTOs** for all endpoints |
| `Program.cs` `IgnoreCycles` | Band-aid | Replace with DTOs; keep as safety net if needed |
| No `SortOrder` on create | Template order broken | Set on insert; support reorder API |
| `Exercise` hard DELETE | Breaks history intent | **Archive** (soft delete) instead |
| Single-page modals only | Cannot support calendar, logging, history | **Routing** + dedicated screens |
| README data model section | Incomplete vs target | Align with this doc after Phase 1 |

### What is missing (net-new)

- PWA manifest, service worker, installability
- Dexie / IndexedDB schema and repositories
- Sync queue, conflict/idempotency strategy, sync status UI
- Weekly calendar and scheduled workouts
- Workout sessions and set logs (weight, reps)
- Active workout persistence across refresh
- Calendar completion colors (green / red / neutral)
- Workout history and “previous performance” hints
- GitHub Actions CI/CD and hosted deployment config
- Auth (single-user MVP may use a fixed token or simple API key initially; see unresolved decisions)

---

## Core user workflows

### 1. Manage exercises

1. Open exercise list.
2. Create exercise (name, optional form link).
3. Edit or **archive** (hide from pickers; keep history).
4. View archived exercises optionally.

### 2. Build workout templates

1. Create template (e.g. “DB Lift A”).
2. Add ordered exercises with planned set count and optional target rep range.
3. Edit, reorder, or remove template lines.
4. Duplicate template optional (post-MVP nice-to-have).

### 3. Plan the week

1. View **weekly calendar** (Mon–Sun or locale week).
2. Assign a template to a date (scheduled workout).
3. Move or remove scheduled workout.
4. Start a workout **without** pre-scheduling (ad hoc session).

### 4. Log a workout

1. Start from scheduled item or template picker.
2. See exercises in template order with planned sets/reps.
3. Log each set: weight (optional), reps, completion.
4. Edit or delete logged sets.
5. See **previous performance** for same exercise when logging.
6. **Finish** (save as completed) or **cancel** (discard session).
7. All changes persist to IndexedDB immediately; sync when online.

### 5. Review calendar and history

1. Calendar: green = completed on scheduled day; red = past scheduled but not completed; neutral = future or unscheduled.
2. History: list completed sessions; drill into sets/reps/weights.

---

## Functional requirements

### FR-1 Exercise management

- FR-1.1 Create exercise with name; optional form URL.
- FR-1.2 Edit exercise metadata.
- FR-1.3 Archive exercise (excluded from pickers, retained for history).
- FR-1.4 List active exercises; optional archived view.

### FR-2 Workout templates

- FR-2.1 CRUD workout templates.
- FR-2.2 Add/remove/reorder exercises on template.
- FR-2.3 Each line: planned set count, optional min/max rep range.
- FR-2.4 Templates are reusable across weeks (not tied to a single date).

### FR-3 Weekly planning

- FR-3.1 Display current week with dates.
- FR-3.2 Assign template to date (scheduled workout).
- FR-3.3 Move scheduled workout to another date.
- FR-3.4 Remove scheduled workout.
- FR-3.5 Start workout from schedule or directly from template.

### FR-4 Workout logging

- FR-4.1 Start session from template (copy planned structure).
- FR-4.2 Log sets with weight and reps; weight optional for bodyweight.
- FR-4.3 Edit/delete logged sets during session.
- FR-4.4 Persist active session to IndexedDB; restore after refresh/close.
- FR-4.5 Finish session (mark complete, link to scheduled date if applicable).
- FR-4.6 Cancel session (discard in-progress work per defined rules).

### FR-5 Calendar status

- FR-5.1 Green: scheduled workout completed on that calendar day.
- FR-5.2 Red: scheduled day in the past, not completed.
- FR-5.3 Neutral: future scheduled, or no schedule.

### FR-6 Workout history

- FR-6.1 List completed sessions (newest first).
- FR-6.2 Session detail: exercises, sets, weights, reps.
- FR-6.3 When logging, show last performance for same exercise.

### FR-7 Synchronization

- FR-7.1 IndexedDB is the **immediate** read/write store for the UI.
- FR-7.2 Mutations enqueue sync operations.
- FR-7.3 Push queue to API when online; pull server changes periodically or on reconnect.
- FR-7.4 Client-generated UUIDs on all entities.
- FR-7.5 Retries must not create duplicates (idempotency).
- FR-7.6 UI shows sync state: local only, pending, synced, error.

---

## Non-functional requirements

| ID | Requirement |
|----|-------------|
| NFR-1 | **Offline-first:** Core flows work with zero network after initial load. |
| NFR-2 | **Performance:** Set log write < 50ms perceived (local Dexie write). |
| NFR-3 | **Durability:** No data loss on refresh/tab close during active workout. |
| NFR-4 | **Installable PWA:** Add to home screen on iOS/Android/desktop where supported. |
| NFR-5 | **Single user (MVP):** No multi-tenant collaboration; design sync for one account/device pair first. |
| NFR-6 | **Simplicity:** Monolith API + Postgres; no microservices. |
| NFR-7 | **Maintainability:** TypeScript strict mode; API DTOs; phased delivery. |

---

## Proposed architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Browser (PWA)                           │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────────┐ │
│  │ React UI    │→ │ Repositories │→ │ Dexie (IndexedDB)   │ │
│  │ (routes)    │  │ (local-first)│  │ source of truth UI  │ │
│  └─────────────┘  └──────┬───────┘  └─────────────────────┘ │
│                          │                                   │
│                   ┌──────▼───────┐  ┌─────────────────────┐ │
│                   │ Sync engine  │→ │ Service Worker      │ │
│                   │ (outbox)     │  │ (app shell cache)   │ │
│                   └──────┬───────┘  └─────────────────────┘ │
└──────────────────────────┼──────────────────────────────────┘
                           │ HTTPS (when online)
┌──────────────────────────▼──────────────────────────────────┐
│              ASP.NET Core Web API                            │
│  Controllers → Services → EF Core → PostgreSQL                │
└─────────────────────────────────────────────────────────────┘
```

### Layer responsibilities

| Layer | Responsibility |
|-------|----------------|
| **React UI** | Screens, forms, calendar; never calls API directly for mutations |
| **Repositories** | CRUD against Dexie; enqueue sync ops |
| **Dexie** | Structured local DB mirroring domain entities |
| **Sync engine** | Process outbox, pull deltas, update sync metadata |
| **Service worker** | Cache static assets; optional API cache rules (careful with mutations) |
| **API** | Validate, persist, idempotent upsert by client UUID |
| **PostgreSQL** | Durable server store; backup source of truth |

---

## Offline-first data flow

### Read path

1. UI asks repository for data.
2. Repository reads **Dexie** (always).
3. If online and stale (TTL or manual refresh), sync engine **pulls** server changes into Dexie.
4. UI re-renders from Dexie ( reactive subscription or state refresh).

### Write path

1. User action → repository writes to **Dexie immediately** (optimistic local truth).
2. Repository appends row to **sync outbox** (`operation`, `entityType`, `payload`, `clientId`).
3. UI shows **saved locally** / **pending sync**.
4. When online, sync engine sends outbox entries to API.
5. On success, mark entity + outbox row **synced**; on failure, retry with backoff, show error state.

### Active workout

- Session state stored in Dexie table `workoutSessions` with status `in_progress`.
- On app load, if `in_progress` session exists, navigate to logging screen.
- Set logs written per keystroke/tap to Dexie.

---

## Synchronization strategy

### Identifiers

- Every syncable entity has **`ClientId`** (UUID v4, generated in browser).
- Server stores `ClientId` as **unique** alternate key; optional internal `int` or `Guid` PK for DB efficiency.

### Idempotency

- API upsert endpoints: `PUT /api/sync/{entityType}/{clientId}` or batch `POST /api/sync/batch`.
- Server: if `ClientId` exists → update; else → insert.
- Outbox retries safe: same payload + same `ClientId` = same result.

### Conflict policy (MVP)

- **Single device / single user:** last-write-wins by `UpdatedAt` (UTC).
- Server timestamp wins on pull if server `UpdatedAt` > local.
- Multi-device editing explicitly **out of scope** for MVP; document as future CRDT or lock-based design.

### Sync metadata (per entity)

| Field | Purpose |
|-------|---------|
| `ClientId` | Stable identity |
| `UpdatedAt` | Conflict comparison |
| `SyncStatus` | `local` \| `pending` \| `synced` \| `error` |
| `DeletedAt` | Tombstone for soft deletes (archive, removed schedule) |

### Pull strategy

- On app start (if online): `GET /api/sync/changes?since={lastSyncToken}`.
- `lastSyncToken` stored in Dexie `meta` table.
- Response: changed entities since token; client merges into Dexie.

### Push strategy

- Process outbox FIFO (or dependency-ordered: exercise before template line).
- Batch size limit (e.g. 50 ops) to avoid huge payloads.
- Exponential backoff on 5xx/network errors.

---

## Initial database entities and relationships

### Entity relationship (target)

```
Exercise (catalog)
    ↑
    │ ExerciseId
WorkoutTemplateExercise (ordered line: planned sets, rep range)
    │
    │ WorkoutTemplateId
WorkoutTemplate

ScheduledWorkout (date + template reference, optional)

WorkoutSession (startedAt, completedAt, status, template snapshot ref)
    │
    └── WorkoutSessionExercise (snapshot: name, sort order, planned sets/reps)
            │
            └── SetLog (setNumber, weight?, reps, completedAt)

SyncOutbox (local only, not on server)
Meta (local only: lastSyncToken, schemaVersion)
```

### Server tables (PostgreSQL)

| Entity | Key fields |
|--------|------------|
| **Exercise** | `ClientId`, `Name`, `FormLink?`, `IsArchived`, `UpdatedAt`, `DeletedAt?` |
| **WorkoutTemplate** | `ClientId`, `Name`, `UpdatedAt`, `DeletedAt?` |
| **WorkoutTemplateExercise** | `ClientId`, `WorkoutTemplateId`, `ExerciseId`, `SortOrder`, `PlannedSets`, `RepMin?`, `RepMax?`, `UpdatedAt` |
| **ScheduledWorkout** | `ClientId`, `Date` (date only), `WorkoutTemplateId`, `UpdatedAt`, `DeletedAt?` |
| **WorkoutSession** | `ClientId`, `WorkoutTemplateId?`, `ScheduledWorkoutId?`, `StartedAt`, `CompletedAt?`, `Status`, `UpdatedAt` |
| **WorkoutSessionExercise** | `ClientId`, `WorkoutSessionId`, `ExerciseId`, `SortOrder`, `PlannedSets`, `RepMin?`, `RepMax?` |
| **SetLog** | `ClientId`, `WorkoutSessionExerciseId`, `SetNumber`, `Weight?`, `Reps`, `UpdatedAt`, `DeletedAt?` |

### Mapping from current schema

| Current | Target |
|---------|--------|
| `Workout` | `WorkoutTemplate` |
| `WorkoutSingleExercise` | `WorkoutTemplateExercise` (+ rep range columns) |
| `Exercise` | `Exercise` (+ `IsArchived`, sync columns) |
| — | `ScheduledWorkout`, `WorkoutSession`, `WorkoutSessionExercise`, `SetLog` |

**Migration approach:** New migrations add columns/tables; optional data migration from existing `Workouts` → `WorkoutTemplates`. May reset dev DB during early phases.

### Dexie schema (mirrors server + local)

Versioned schema in `web/src/db/schema.ts` (proposed):

- Tables match entity names in camelCase.
- Indexes: `ClientId`, `SyncStatus`, `Date` (scheduled), `Status` (session), `UpdatedAt`.

---

## Suggested frontend folder structure

```
web/
├── public/
│   ├── icons/                 # PWA icons
│   └── manifest.webmanifest
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── routes/                # react-router
│   │   ├── CalendarPage.tsx
│   │   ├── TemplatesPage.tsx
│   │   ├── TemplateDetailPage.tsx
│   │   ├── ActiveWorkoutPage.tsx
│   │   ├── HistoryPage.tsx
│   │   └── ExercisesPage.tsx
│   ├── components/            # presentational + feature components
│   ├── db/
│   │   ├── dexie.ts           # Dexie instance
│   │   ├── schema.ts          # versions
│   │   └── repositories/      # exerciseRepo, templateRepo, sessionRepo, syncRepo
│   ├── sync/
│   │   ├── outbox.ts
│   │   ├── syncEngine.ts
│   │   └── apiClient.ts       # fetch wrapper, base URL, auth header
│   ├── hooks/
│   ├── types/
│   └── utils/
├── vite.config.ts             # + vite-plugin-pwa
└── package.json               # + dexie, react-router-dom, vite-plugin-pwa
```

**Current `web/src/components/*`:** refactor into routes + smaller components; logic moves to repositories.

---

## Suggested backend folder structure

```
api/
├── Controllers/
│   ├── ExercisesController.cs
│   ├── WorkoutTemplatesController.cs
│   ├── ScheduledWorkoutsController.cs
│   ├── WorkoutSessionsController.cs
│   └── SyncController.cs          # batch upsert + changes feed
├── Models/
├── DTOs/
│   ├── Requests/
│   └── Responses/
├── Data/
│   └── AppDbContext.cs
├── Services/                        # optional: SyncService, SessionService
├── Migrations/
└── Program.cs
```

**Current controllers:** replace or rename; fix `WorkoutSingleExerciseController` bugs during template-line migration.

---

## API endpoint proposal

### Exercises

| Method | Path | Notes |
|--------|------|-------|
| GET | `/api/exercises` | Active only; `?includeArchived=true` optional |
| POST | `/api/exercises` | Body includes `clientId` |
| PUT | `/api/exercises/{clientId}` | Upsert by client id |
| PATCH | `/api/exercises/{clientId}/archive` | Set archived |

### Workout templates

| Method | Path | Notes |
|--------|------|-------|
| GET | `/api/templates` | List summaries |
| GET | `/api/templates/{clientId}` | With ordered lines + exercise names |
| PUT | `/api/templates/{clientId}` | Upsert template |
| PUT | `/api/templates/{clientId}/exercises/{lineClientId}` | Upsert line |
| DELETE | `/api/templates/{clientId}/exercises/{lineClientId}` | Remove line |

### Weekly schedule

| Method | Path | Notes |
|--------|------|-------|
| GET | `/api/schedule?from=&to=` | Scheduled workouts in range |
| PUT | `/api/schedule/{clientId}` | Upsert scheduled workout |
| DELETE | `/api/schedule/{clientId}` | Remove |

### Sessions & logging

| Method | Path | Notes |
|--------|------|-------|
| POST | `/api/sessions` | Start session (from template + optional schedule id) |
| GET | `/api/sessions/{clientId}` | Session with exercises + set logs |
| PUT | `/api/sessions/{clientId}` | Update status (complete/cancel) |
| PUT | `/api/sessions/{clientId}/sets/{setClientId}` | Upsert set log |
| GET | `/api/exercises/{clientId}/history?limit=` | Previous performance |

### Sync (bulk)

| Method | Path | Notes |
|--------|------|-------|
| POST | `/api/sync/push` | Batch outbox operations |
| GET | `/api/sync/changes?since=` | Delta pull |

**Current endpoints** (`/api/workout`, `/api/workoutexercise`) deprecated after migration; maintain temporarily behind feature flag if needed.

---

## MVP screen descriptions

| Screen | Purpose |
|--------|---------|
| **Week calendar** | 7-day grid; assign/move/remove templates; color coding; tap day → schedule or start |
| **Templates list** | All templates; create; navigate to detail |
| **Template detail** | Ordered exercises, planned sets/reps; add/edit/reorder |
| **Exercises list** | Catalog; create/edit/archive |
| **Active workout** | Logging UI; set rows; weight/reps; previous performance hint; finish/cancel |
| **History list** | Completed sessions by date |
| **Session detail** | Read-only log of a past workout |
| **Sync indicator** | Global: offline / pending count / synced / error (app bar) |

**Current UI:** single-page list + detail + modals → replaced by routed screens above; reuse form patterns where possible.

---

## Error and recovery behavior

| Scenario | Behavior |
|----------|----------|
| Offline | All reads/writes via Dexie; show offline badge; queue sync |
| API 5xx on sync | Retry with backoff; show pending count; allow continued local use |
| API 4xx validation | Mark outbox item error; show user message; do not block other ops |
| Postgres down (dev) | Local app still works; sync pending (same as offline) |
| Corrupt local DB | Offer reset local cache + full pull from server (destructive; confirm dialog) |
| Active session interrupted | Restore from Dexie on next launch |
| Duplicate sync retry | Server idempotent on `ClientId` — no duplicate rows |

**Current:** red error strings when API fails; no offline path. Replace with sync-status-aware messaging.

---

## Testing strategy

| Phase | Approach |
|-------|----------|
| **Now** | Manual smoke checklist in README; defer automated tests |
| **Phase 2+** | API integration tests against `liftlog_test` DB (sync upsert, idempotency) |
| **Phase 3+** | Dexie repository unit tests (in-memory fake) |
| **Phase 4+** | Playwright: install PWA, offline mode, log workout, verify IndexedDB |
| **Sync** | Dedicated tests: push same `ClientId` twice → one row |

Tests are a **learning exercise**; prioritize when sync and sessions land (high regression risk).

---

## Security considerations

| Topic | MVP approach |
|-------|--------------|
| **Auth** | Single-user API key or JWT in header; no public anonymous write access in prod |
| **HTTPS** | Required in production |
| **Secrets** | Env vars only; never in git |
| **CORS** | Restrict to deployed PWA origin |
| **Input validation** | Server-side on all DTOs |
| **Data isolation** | Single user now; when multi-user added later, scope all queries by `UserId` |
| **IndexedDB** | Device-local; not encrypted in MVP (acceptable for personal gym data; note in doc) |

---

## Deployment approach

### Environments

| Env | Frontend | API | Database |
|-----|----------|-----|----------|
| **Local** | Vite `:5173` | `dotnet watch` `:5198` | Docker Postgres `:5433` |
| **Production** | Static hosting (Cloudflare Pages, Netlify, or API static files) | Container or PaaS (Fly.io, Railway, Azure) | Managed Postgres |

### CI/CD (GitHub Actions)

1. On PR: lint frontend, `dotnet build`, optional tests.
2. On merge to `main`: build frontend → deploy static assets; build API → deploy container; run EF migrations against prod DB.

### PWA production

- `npm run build` produces `web/dist`.
- Service worker precaches app shell.
- API URL via `VITE_API_BASE_URL` at build time.

### Current infra reuse

- Keep `docker-compose.yml` for **local dev only**.
- Production Postgres is **hosted**, not Docker on laptop.

---

## Implementation phases

### Phase 0 — Foundation (current → baseline)

- [ ] Add this design doc; align README product scope
- [ ] Fix `WorkoutSingleExerciseController` bugs (or freeze legacy API)
- [ ] Add `VITE_API_BASE_URL`; stop hardcoding localhost in new code

### Phase 1 — Local-first skeleton

- [ ] Add Dexie schema + repositories for Exercise, WorkoutTemplate, TemplateExercise
- [ ] Migrate existing UI to read/write Dexie first (API as secondary sync target)
- [ ] Introduce `ClientId` on server entities + migrations
- [ ] Basic sync push/pull for templates and exercises

### Phase 2 — PWA shell

- [ ] `vite-plugin-pwa`, manifest, icons
- [ ] Service worker app shell caching
- [ ] Installable on mobile home screen
- [ ] Offline indicator + sync status UI

### Phase 3 — Weekly planning

- [ ] ScheduledWorkout entity (client + server)
- [ ] Calendar screen with assign/move/remove
- [ ] Calendar color rules (green/red/neutral)

### Phase 4 — Workout logging

- [ ] WorkoutSession, SessionExercise, SetLog entities
- [ ] Active workout screen; persist across refresh
- [ ] Finish/cancel flows
- [ ] Previous performance lookup

### Phase 5 — History + polish

- [ ] History list and session detail
- [ ] Exercise archive in UI
- [ ] Template edit/reorder/delete
- [ ] Error recovery UX

### Phase 6 — Production deploy

- [ ] GitHub Actions pipeline
- [ ] Hosted API + Postgres
- [ ] HTTPS, CORS, secrets
- [ ] Smoke tests in CI

---

## Risks and unresolved design decisions

| ID | Decision | Options | Recommendation |
|----|----------|---------|----------------|
| D-1 | **Auth for MVP** | API key in env vs simple login vs none (local only) | API key in PWA build for solo prod deploy |
| D-2 | **Rep range storage** | Single `Reps` vs `RepMin`/`RepMax` | `RepMin`/`RepMax` optional; keep `PlannedSets` |
| D-3 | **Cancel session** | Hard delete vs mark cancelled | Mark `cancelled`; tombstone sync |
| D-4 | **Week start day** | Sunday vs Monday | User setting in Dexie `meta`; default locale |
| D-5 | **Weight units** | lb vs kg | Store number only + unit in `meta` (default lb) |
| D-6 | **Legacy API** | Break vs dual-run | Dual-run one phase; then remove `/api/workout` |
| D-7 | **Pull frequency** | On focus vs interval vs manual | On app focus + on reconnect |
| D-8 | **iOS PWA limits** | Background sync unreliable | Document; rely on foreground sync on open |
| D-9 | **Data migration** | Migrate existing Postgres rows to ClientIds | One-time script; acceptable to reset dev DB |
| D-10 | **Testing investment** | When to add API tests | Start at Phase 1 sync endpoints |

---

## Decision log

| Date | Decision |
|------|----------|
| 2026-07-14 | MVP is offline-first PWA; Dexie local-first; ASP.NET sync backend; single user |
| 2026-07-14 | Explicit non-goals: analytics, AI, nutrition, social, multi-user collaboration |
| 2026-07-14 | Current 3-table schema seeds **template** domain; sessions/scheduling are net-new |
| 2026-07-14 | Defer automated tests until sync layer exists |

---

## Appendix: Current file inventory (reference)

**Keep/refactor:** `api/Models/*`, `api/Data/AppDbContext.cs`, `web/src/components/*` (patterns), `docker-compose.yml`, `scripts/prepare-dev.mjs`, root `package.json` dev orchestration.

**Replace/add:** PWA assets, Dexie layer, sync engine, routed pages, new API controllers/DTOs, GitHub Actions workflows.
