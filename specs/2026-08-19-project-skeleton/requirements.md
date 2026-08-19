# Requirements — Phase 1: Project Skeleton

> Feature directory: `specs/2026-08-19-project-skeleton/`
> Branch: `phase-1-project-skeleton`

## Context

This is the **first phase** of the roadmap — see
[`specs/roadmap.md`](../roadmap.md) *Phase 1 — Project skeleton*.

The repository is at its starting point: only `specs/` and `README.md` exist,
with no `src/`, no `package.json`, and no git history of code. This phase lays
the foundation that every later phase (CRUD, persistence, validation, search)
builds on, per the mission (see [`specs/mission.md`](../mission.md)) to deliver
a reliable, well-structured Book REST API that is shippable, testable, and
documented in small increments.

## Scope (in)

This phase is intentionally thin: scaffold the app and prove the toolchain runs.

1. Init `package.json` with `"type": "module"` (see
   [`specs/tech-stack.md`](../tech-stack.md) — Node.js + Express, JS ES modules).
2. Install runtime dep: `express`. Install dev dep for tests: `supertest`
   (drives the Phase 1 smoke test; also matches the tech-stack testing choice).
3. Create the project structure:
   - `src/server.js` — app entry point / server bootstrap.
   - `src/app.js` — Express app wiring (separate from server for testability).
   - `src/routes/` — route definitions directory (containing the health route).
4. Add a `GET /health` endpoint returning `{ "status": "ok" }`.
5. Add `npm` scripts referenced by the tech-stack: `dev`, `start`, `test`.

## Out of scope (later phases)

Explicitly deferred per roadmap and mission (see mission non-goals):

- In-memory / DB book CRUD  → Phase 2
- PostgreSQL / Neon persistence → Phase 3
- Zod validation & error handling → Phase 4
- Search / filtering, OpenAPI spec, final README polish → Phase 5
- User accounts, payments, ordering, inventory (mission non-goals).

None of these should appear in this phase's implementation.

## Decisions

- **Language:** JavaScript with ES modules (`"type": "module"`); no build step,
  no TypeScript (a noted upgrade path only), per tech-stack.
- **Framework:** Express, kept minimal and familiar.
- **App/server split:** `app.js` exports the configured Express app so it can be
  exercised by tests without opening a real port; `server.js` is the thin
  bootstrap that calls `listen`.
- **Routes directory:** `src/routes/` holds Express `Router` instances, giving
  a clean place for future CRUD routes without restructuring.
- **`/health` shape:** literal JSON object `{ "status": "ok" }` — contract
  established here and asserted in validation.
- **Dotenv/persistence** are not part of this phase; no env handling needed yet.

## Acceptance summary

- `npm start` (or `npm run dev`) boots the server without error.
- `GET /health` responds `200` with JSON `{ "status": "ok" }`.
- `npm test` runs a green smoke test against the app.