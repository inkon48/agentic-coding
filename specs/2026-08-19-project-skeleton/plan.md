# Plan — Phase 1: Project skeleton

> Ordered, independently completable task groups. Each group ends in a measurable
> state; the whole phase ends with Validation (`../validation.md`) passing.

## Task Group 1 — Initialize package & install dependencies

- [ ] Create `package.json` with `"type": "module"` and sensible baseline fields
      (name, version, description, `main: "src/server.js"`, `engines.node >= 20`).
- [ ] `npm install express` (runtime).
- [ ] `npm install -D supertest` (dev, for the smoke test).
- [ ] Ensure `node_modules` and any lockfile are created; add `.gitignore` to
      keep `node_modules/`, `.env`, and OS/editor noise out of the repo.
- **Done when:** `npm install` completes cleanly and `package.json` lists the
  expected `express` (and dev `supertest`) dependencies.

## Task Group 2 — Project structure: app wiring

- [ ] Create `src/app.js` exporting the configured Express app.
- [ ] Mount `src/routes/` routers in `app.js`.
- [ ] Keep `app.js` free of `listen()` — it is the testable unit.
- **Done when:** `app.js` can be imported and returns a configured Express app
  without starting a server.

## Task Group 3 — Health route

- [ ] Create `src/routes/health.js` (or an index under `src/routes/`) with a
      `GET /` (mounted at `/health`) handler.
- [ ] Handler responds `200` with JSON `{ "status": "ok" }`.
- **Done when:** requesting `/health` over HTTP returns the exact contract shape.

## Task Group 4 — Server bootstrap

- [ ] Create `src/server.js` importing `app` and calling `listen` on a
      configurable port (default e.g. `3000`, overridable via env if desired).
- [ ] Log a startup message and handle the port cleanly.
- **Done when:** running the server entry point starts it without throwing.

## Task Group 5 — npm scripts & smoke test

- [ ] Add `npm run dev` → `node --watch src/server.js` (per tech-stack).
- [ ] Add `npm start` → `node src/server.js`.
- [ ] Add `npm test` → `node --test` (Node's built-in runner).
- [ ] Write a smoke test (Supertest) that hits `GET /health` and asserts
      `200` + `{ status: "ok" }` against the `app.js` import.
- **Done when:** `npm test` runs green and `GET /health` is covered.