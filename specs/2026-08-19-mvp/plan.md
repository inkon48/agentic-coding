# Plan — MVP: Full Book REST API (Phases 2–5)

> Ordered, independently completable task groups, mirroring the roadmap phase
> order. Each group ends in a measurable state; the whole MVP ends with
> Validation (`./validation.md`) passing. Builds on the Phase 1 skeleton.

## Group 1 — Book shape & in-memory repository (Phase 2 foundations)

- [x] Define the `Book` shape (id, title, author, publishedYear, createdAt, etc.)
      in a shared module (e.g. `src/books/book.js`).
- [x] Add an in-memory `BookRepository` (e.g. `src/books/inMemoryRepository.js`)
      with create / list / getById / update / delete.
- [x] Repository methods return consistent results (e.g. `null` when a resource
      is absent on getById/update/delete) so routes can map to 404.
- **Done when:** the in-memory repository passes a small unit test for all five
  operations without any HTTP layer.

## Group 2 — Books REST routes (Phase 2 wiring)

- [x] Add `src/books/routes.js` (mounted at `/books`) with the five endpoints:
      `GET /books`, `GET /books/:id`, `POST /books`, `PUT /books/:id`,
      `DELETE /books/:id`.
- [x] Mount the router in `src/app.js` (skeleton already wires routes).
- [x] Wire supertest integration tests covering all five routes and the 404
      path (missing id).
- **Done when:** `npm test` runs green and all five routes work via HTTP.

## Group 3 — Zod validation & error middleware (Phase 4; black-box input comes early)

- [x] Add `zod` dependency and schemas for the book body and `:id` param.
- [x] Reject invalid input with `400` and a consistent error shape.
- [x] Add error middleware standardizing `404` and `500` responses.
- [x] Cover validation and error paths with tests.
- **Done when:** bad input → 400, missing → 404, unexpected → 500, all consistent
  and tested. (Ordered here so every later route/tests stay validated.)

## Group 4 — PostgreSQL persistence (Phase 3)

- [x] Add `pg` and `dotenv`; load `DATABASE_URL` from `.env`.
- [x] Add a schema/migration init script (`schema.sql` + `npm run migrate` or
      startup init) creating a `books` table.
- [x] Add a `PostgresBookRepository` implementing the same interface as Group 1.
- [x] Select repository by configuration (env/base) so dev uses Postgres while
      the existing tests can use the in-memory or a test DB.
- [x] Point DB-backed tests at a **separate test database** via a test-specific
      `DATABASE_URL`.
- **Done when:** books persist across a restart (verified against a test DB) and
  existing CRUD/validation tests still pass against the DB repository.

## Group 5 — Search / filtering (Phase 5)

- [x] Support `?title=` and `?author=` substring filtering on `GET /books` in
      both repositories.
- [x] Combine filtering with the list route; keep the response shape unchanged.
- [x] Add tests for filtering in in-memory and DB-backed modes.
- **Done when:** `GET /books?title=...` and `GET /books?author=...` return the
  matching subset.

## Group 6 — OpenAPI spec & README polish (Phase 5)

- [x] Write `docs/openapi.yml` (OpenAPI 3) documenting all endpoints, schemas,
      and error responses.
- [x] Update the root `README.md` with run/usage/docs instructions (per
      tech-stack and mission).
- [x] Do a final review pass against mission non-goals to confirm no scope creep.
- **Done when:** the API is fully documented and README reflects the finished MVP.