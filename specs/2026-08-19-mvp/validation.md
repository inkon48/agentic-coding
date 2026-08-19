# Validation — MVP: Full Book REST API (Phases 2–5)

> How we know the MVP succeeded **and** can be merged.
> Any failure here blocks the merge onto `mvp`.

## Gate criteria (all must pass)

| # | Check | Command / method | Expected |
|---|-------|------------------|----------|
| 1 | Dependencies install | `npm install` | exit 0, no fatal errors |
| 2 | Full test suite green | `npm test` | all tests pass, exit 0 |
| 3 | All 5 `/books` routes work | supertest integration tests | create/read-all/read-one/update/delete all green |
| 4 | Persistence across restart | DB-backed test: insert, drop conn, reconnect | the record is still present |
| 5 | Validation & errors | supertest error-path tests | `400` invalid, `404` missing, `500` unexpected, consistent shape |
| 6 | Search/filter works | supertest filter tests (`?title=`, `?author=`) | only matching subset returned |
| 7 | OpenAPI 3 spec present | file check + endpoint coverage | `docs/openapi.yml` exists, covers all endpoints |
| 8 | README reflects MVP | manual read | run/usage/docs instruction up to date |
| 9 | No scope creep | diff/review vs mission non-goals | no auth/accounts/payments/orders/inventory/complex search |
| 10 | Clean repo state | `git status` + `.gitignore` | `node_modules/`, `.env`, logs not tracked |

## Manual reviewer recipe

1. `npm install`, then `npm test` → all green (Gates 1–3).
2. Persistence gate: with a test `DATABASE_URL` set, run the DB-backed test that
   writes a book, reconnects, and reads it back — record survives (Gate 4).
3. Validation smoke: `POST /books` with a bad body → `400`; `GET /books/does-not-exist`
   → `404`; both with the documented error shape (Gate 5).
4. `GET /books?title=...` returns only matches; same for `?author=` (Gate 6).
5. Open `docs/openapi.yml` and confirm every endpoint from the roadmap is
   represented; skim README run/usage docs (Gates 7–8).
6. `git status --porcelain` — only intended files; secrets/artifacts ignored
   (Gate 10).

## Architectural invariants (non-regressions to preserve)

- `app.js` never calls `listen()`; `server.js` does (kept from Phase 1).
- Routes stay under `src/routes/` (or a per-domain subfolder mounted in `app.js`).
- ES modules throughout; no CommonJS bounce-back.
- Data-access goes through the `BookRepository` interface so in-memory ↔ Postgres
  stays swappable; controllers never touch SQL directly.
- Error shape is singular and reused by validation, `404`, and `500` middleware.
- No mission non-goal functionality sneaks in.

## Definition of merge-ready

- All ten gate criteria pass on the `mvp` branch.
- These spec docs (`requirements.md`, `plan.md`, `validation.md`) are consistent
  with what shipped — no hidden TODOs or silently dropped task groups.
- A reviewer has run the manual recipe (including the persistence gate against a
  real test database).
- The branch is up to date/rebaseable and the implementation is squashed into
  clean, reviewable commits before **merging to default**, at which point the
  MVP is handed off and the broader online-store vision can be planned.