# Mission

## Purpose

Build a **Book REST API** — a reliable, well-structured backend that lets users
**manage a library of books online**.

## Stakeholder input

- **Mary** wants an API that can *add, update, delete, and retrieve* books effectively.
- **Kevin** wants a book library that can *store books online*.

## What we commit to

1. **Library CRUD as the core** — provide effective, predictable endpoints to
   **C**reate, **R**ead, **U**pdate, and **D**elete books. This is the MVP and
   directly satisfies Mary's ask.
2. **Online storage** — books are persisted so they survive restarts, giving Kevin
   a real online book library rather than an in-memory scratch store.
3. **Effective by design** — REST-ful, predictable HTTP semantics, clear
   validation, and useful error messages so consumers can integrate easily.
4. **Grow toward a store** — the full "online book store / library" vision
   (search, filtering, availability, ratings, user accounts) is deliberately
   **out of scope for the MVP** and will be layered on top of the solid foundation
   we build first.

## Non-goals (for the MVP)

- User accounts / authentication & authorization (only single-tenant storage for now).
- Payments, orders, or inventory.
- Complex search, ratings, or availability tracking (added in later phases).

## Success criteria (MVP)

- A developer can create, fetch (all and by id), update, and delete books via a
  clean REST API.
- Books persist across server restarts (stored, not lost).
- The API returns consistent, documented responses and clear error codes.
- Everything is shippable, testable, and documented in small increments.
