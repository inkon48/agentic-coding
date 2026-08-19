# Requirements — MVP: Full Book REST API

> Feature directory: `specs/2026-08-19-mvp/`
> Branch: `mvp`

## Context

This feature completes the **MVP** for the Book REST API. It executes the
remaining roadmap phases (2–5) on top of the already-scaffolded **Phase 1
skeleton** (see the sibling feature spec
[`../2026-08-19-project-skeleton/`](../2026-08-19-project-skeleton/)).

The goal is to fully satisfy the mission's success criteria
([`../mission.md`](../mission.md)):

- A developer can **create, fetch (all + by id), update, and delete** books via a
  clean REST API (Mary's ask).
- Books **persist across server restarts** — stored online (Kevin's ask).
- The API returns **consistent, documented responses** and **clear error codes**.
- Everything is **shippable, testable, and documented** in small increments.

All implementation follows the technology decisions in
[`../tech-stack.md`](../tech-stack.md).

## Scope (in) — roadmap Phases 2–5

1. **Phase 2 — In-memory book CRUD**
   - Define the `Book` shape (id, title, author, publishedYear, etc.).
   - Create/Read (all + by id)/Update/Delete behind a **repository module**
     backed by an in-memory store (no persistence yet, swappable later).
   - Wire REST endpoints: `GET /books`, `GET /books/:id`, `POST /books`,
     `PUT /books/:id`, `DELETE /books/:id`.

2. **Phase 3 — Persistence (PostgreSQL / Neon)**
   - Add a `pg`-backed repository connected via `DATABASE_URL` (dotenv).
   - Add a schema/migration init script (startup or `npm run migrate`).
   - Tests run against a **separate test database** (dedicated `DATABASE_URL`),
     isolated and fast.

3. **Phase 4 — Validation & error handling**
   - Zod schemas for request bodies and params.
   - Clear `400` responses with a consistent error shape.
   - Standardized `404` and `500` handling via error middleware.

4. **Phase 5 — Search & polish**
   - Basic filtering/search on list (`?title=`, `?author=`).
   - **OpenAPI 3** spec documenting all endpoints.
   - Final review of mission non-goals; update README with run/usage docs.

## Out of scope (architecture intentionally kept)

Per mission non-goals and roadmap, explicitly **excluded** from the MVP:

- User accounts / authentication & authorization (single-tenant storage only).
- Payments, orders, or inventory.
- Complex search, ratings, or availability tracking (basic `?title=`/`?author=`
  substring filtering only).
- TypeScript (noted upgrade path only).

## Decisions

- **Repository abstraction:** CRUD code talks to a `BookRepository` interface so
  the in-memory (Phase 2) and PostgreSQL (Phase 3) implementations are swappable —
  matching tech-stack's "data-access layer isolated behind a repository module."
- **Persistence:** `pg` (node-postgres) against a Neon Postgres; connection via
  `DATABASE_URL` loaded through `dotenv`. Schema created by an init/migrate
  script, not an external ORM.
- **Validation:** Zod for request bodies and params; rejection produces `400`
  with a consistent `{ error: { ... } }`-style envelope.
- **Errors:** centralized middleware standardizing `404` (not found) and `500`
  (unexpected) responses with a common shape.
- **IDs:** opaque string ids (e.g. crypto `randomUUID`) so client and API agree
  on stable identifiers across in-memory and DB implementations.
- **Test isolation:** `npm test` targets a separate test database via its own
  `DATABASE_URL`; it never touches the dev/prod Neon DB. The Phase 2 in-memory
  tests run with no DB at all; Phase 3+ DB tests require the test DB to be
  reachable.
- **Docs:** an `openapi.yml` (OpenAPI 3) document under e.g. `docs/` describing
  every endpoint, plus README run/usage instructions.

## Acceptance summary

- All five `/books` endpoints work and are covered by supertest integration tests.
- Books survive a server restart (persisted in Neon), verified against a test DB.
- Invalid input → `400`; missing resource → `404`; unexpected error → `500`, all
  with a consistent error shape.
- `?title=` / `?author=` filtering works.
- OpenAPI 3 spec present; README documents how to run/test/use the API.