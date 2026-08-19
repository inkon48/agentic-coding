# Tech Stack

> Decision: **Node.js + Express**, kept minimal and familiar.

## Runtime & framework

- **Node.js** (LTS, >= 20) — JavaScript runtime.
- **Express** — HTTP web framework for the API routing and middleware.
- **JavaScript (ES modules)** as the default language to stay minimal and
  approachable. *TypeScript is a noted upgrade path if the codebase grows large
  enough to justify it.*

## Persistence

- **PostgreSQL** (Postgres) hosted on **Neon** — a serverless, managed Postgres
  that gives Kevin a real online book library with no local database server to run.
- Connected via the `pg` driver (node-postgres) — the classic, well-established
  PostgreSQL client, lightweight and SQL-first, fitting our minimal style.
- Connection string comes from the **`DATABASE_URL`** environment variable
  (from the Neon dashboard). Schema/migrations are created by a small init script
  at startup.
- Data-access layer is isolated behind a repository module so the storage
  implementation stays swappable.

## Validation

- **Zod** (`zod`) for schema definition and validation of request bodies/params.
  Keeps validation declarative and type-safe.

## Testing

- **Node's built-in test runner** (`node --test`) + **Supertest** for HTTP-level
  integration tests against the running app.
- Tests run against a **separate test database** (a dedicated Neon DB or a local
  Postgres) referenced by a test-specific `DATABASE_URL`, independent from dev.

## Docs & DX

- **OpenAPI 3** spec (hand-written or generated) documenting all endpoints —
  aligned with the roadmap's final polish phase.
- `npm scripts`:
  - `npm run dev` — start server with `node --watch`.
  - `npm start` — start server normally.
  - `npm test` — run the test suite.

## Dependency checklist (npm)

| Package        | Purpose                        |
|----------------|--------------------------------|
| `express`      | HTTP routing/middleware        |
| `zod`          | request validation             |
| `pg`           | PostgreSQL driver (node-postgres)|
| `dotenv`       | load `DATABASE_URL` from `.env`|
| `supertest`    | integration tests (dev)        |

## Why these choices

- **Express**: the most familiar, minimal Node HTTP layer — matches the "minimal,
  familiar" goal.
- **PostgreSQL on Neon**: a real, managed online database for Kevin's library —
  no local DB server to install, cloud-hosted, and SQL-standard.
- **pg driver + zod + node test runner + supertest**: small, modern, standard
  tooling with no heavyweight frameworks or ORMs.
- **dotenv**: keeps credentials (like the Neon `DATABASE_URL`) out of the repo.
