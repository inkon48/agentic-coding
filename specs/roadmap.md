# Roadmap

> High-level implementation order in **very small, shippable, testable phases**.
> Each phase is independently completable and validated before moving on.

## Phase 1 — Project skeleton

- Init `package.json` (type: `module`), install `express` (and dev deps).
- Create project structure:
  - `src/server.js` — app entry point / server bootstrap.
  - `src/app.js` — Express app wiring (separate from server for testability).
  - `src/routes/` — route definitions.
- Add a `GET /health` endpoint returning `{ "status": "ok" }`.
- Add `npm` scripts (`dev`, `start`, `test`).
- **Done when:** server starts, `/health` responds, `npm test` runs green.

## Phase 2 — In-memory book CRUD

- Define the `Book` shape (id, title, author, publishedYear, etc.).
- Implement **Create / Read (all + by id) / Update / Delete** using an in-memory
  store (no persistence yet) behind a repository module.
- Wire REST endpoints:
  - `GET    /books`      — list all books
  - `GET    /books/:id`  — get one book
  - `POST   /books`      — add a book
  - `PUT    /books/:id`  — update a book
  - `DELETE /books/:id`  — delete a book
- **Done when:** all five routes work via HTTP and are covered by integration
  tests (supertest) — Mary can add/update/delete/retrieve books effectively.

## Phase 3 — Persistence (PostgreSQL / Neon)

- Add the repository backed by **PostgreSQL** via the `pg` driver, connected
  to a **Neon** database through the `DATABASE_URL` env var.
- Add a schema/migration init script (runs at startup or via an npm script).
- Point tests at a **separate test database** (dedicated Neon DB or local Postgres)
  so they stay isolated and fast.
- **Done when:** books survive a server restart — Kevin's books are truly stored
  online in Neon; all existing tests still pass against the DB repository.

## Phase 4 — Validation & error handling

- Add Zod schemas for request bodies/params.
- Reject invalid input with clear `400` responses and consistent error shape.
- Standardize not-found (`404`) and unexpected-error (`500`) handling via a common
  error middleware.
- **Done when:** bad requests are rejected gracefully with consistent, documented
  errors; tests cover validation and error paths.

## Phase 5 — Search & polish

- Add basic filtering/search on list (`?title=`, `?author=` query params).
- Write an **OpenAPI 3** spec documenting all endpoints.
- Final review of the mission non-goals; update README with run/usage docs.
- **Done when:** search works, API is fully documented, and docs/README reflect
  the final MVP — ready to hand off and to plan the broader online store vision.
