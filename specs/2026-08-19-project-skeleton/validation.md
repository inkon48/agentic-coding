# Validation — Phase 1: Project skeleton

> How we know this implementation succeeded **and** can be merged.
> Any failure here blocks the merge.

## Gate criteria (all must pass)

| # | Check | Command / method | Expected |
|---|-------|------------------|----------|
| 1 | Dependencies install cleanly | `npm install` | exit 0, no fatal errors |
| 2 | Server boots | `npm start` (or `node src/server.js`) | starts, prints startup log, stays up |
| 3 | `/health` responds with contract | `curl -s localhost:<port>/health` | `200` + body `{ "status": "ok" }` |
| 4 | Test suite is green | `npm test` | all tests pass (exit 0) |
| 5 | Holds the contract over HTTP | Supertest smoke test asserting `/health` | test asserts status + exact JSON body |
| 6 | No stray artifacts committed | `git status` check + `.gitignore` | `node_modules/`, `.env`, editor noise not tracked |

## Manual recipe (verifiable by a reviewer)

1. `npm install` from a clean checkout → succeeds (Gate 1).
2. `npm start`, then `curl -i http://localhost:3000/health` → `HTTP/1.1 200`
   with body `{"status":"ok"}` (Gate 2 & 3). Stop the server.
3. `npm test` → `# tests 1`, all `pass`, exit code 0 (Gate 4 & 5).
4. `git status --porcelain` shows only intended project files; `node_modules/`
   is ignored (Gate 6).

## Architectural invariants (non‑regressions to preserve)

- `app.js` does **not** call `listen()`; the server entry point does. This keeps
  the app importable and testable.
- Routes live under `src/routes/` so future CRUD mounts without restructuring.
- Modules are ES modules (`import`/`export`); no CommonJS bounce-back.
- No scope creep: nothing from Phases 2–5 or the mission non‑goals is present.

## Definition of merge‑ready

- All six gate criteria pass on the `phase-1-project-skeleton` branch.
- These spec docs (`requirements.md`, `plan.md`, `validation.md`) are consistent
  with what shipped (no TODOs left, no cancelled task groups concealed).
- A reviewer (or CI, once available) has run the manual recipe successfully.
- The branch is rebased/up‑to‑date and squashed into clean, reviewable commits
  before merging to the default branch.