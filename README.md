# Book REST API

A reliable, well-structured **Book REST API** — the MVP for managing a library
of books online. Built on **Node.js + Express** (ES modules), **PostgreSQL on
Neon**, and **Zod** validation. See `specs/mission.md`, `specs/tech-stack.md`,
and `specs/roadmap.md` for guidance and the broader vision.

## Stakeholder input

- **Mary** wants an API to *add, update, delete, and retrieve* books effectively.
- **Kevin** wants a book library that can *store books online*.

## Features (MVP)

- **CRUD** — create, read (all + by id), update, delete books.
- **Persistence** — books stored in PostgreSQL/Neon via `DATABASE_URL`; fall back
  to an in-memory store when unset.
- **Validation** — Zod-validated request bodies/params with consistent `400`s.
- **Errors** — standardized `404` / `500` error shape via middleware.
- **Search** — `?title=` and `?author=` substring filtering.
- **Docs** — OpenAPI 3 spec + this README.

## Requirements

- **Node.js >= 20** (uses the built-in test runner and `node --watch`).
- A Postgres/Neon connection string (only needed for real persistence).

## Setup

```bash
npm install
cp .env.example .env   # then set DATABASE_URL (optional; needed for persistence)
```

## Run

```bash
npm start              # production-style start
npm run dev            # start with node --watch (auto-restart on change)
```

- Without `DATABASE_URL`, the API runs on the in-memory store.
- With `DATABASE_URL` set, the schema is migrated automatically on startup
  (or manually via `npm run migrate`).
- Server default port: **3000** (override with `PORT`).

## Endpoints

| Method | Path                 | Description                          |
|--------|----------------------|--------------------------------------|
| GET    | `/health`            | Liveness check → `{ "status": "ok" }`|
| GET    | `/books`             | List all (or `?title=` / `?author=`)|
| GET    | `/books/:id`         | Get one book                         |
| POST   | `/books`             | Create a book                        |
| PUT    | `/books/:id`         | Update a book (full replace)         |
| DELETE | `/books/:id`         | Delete a book                        |

Example request body (`POST/PUT /books`):

```json
{ "title": "Clean Code", "author": "Robert C. Martin", "publishedYear": 2008 }
```

## Testing

```bash
npm test
```

- In-memory CRUD/validation/search tests always run.
- **Persistence tests** only run when `TEST_DATABASE_URL` (or `DATABASE_URL`) is
  set — they use a disposable Postgres/Neon DB and prove books survive a restart.
  Without it, the DB-backed tests are skipped so the suite stays green anywhere.

## API docs

Interactive docs (Swagger UI) are served at:

- **`GET /api-docs`** — browsable, interactive Swagger UI (with "Try it out").

The raw machine-readable spec lives at [`docs/openapi.yml`](docs/openapi.yml). 
# agentic-coding
