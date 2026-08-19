CREATE TABLE IF NOT EXISTS books_demo (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title          TEXT        NOT NULL,
  author         TEXT        NOT NULL,
  published_year INTEGER     NOT NULL,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_books_demo_title  ON books_demo (title);
CREATE INDEX IF NOT EXISTS idx_books_demo_author ON books_demo (author);