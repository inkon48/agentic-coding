import 'dotenv/config';
import { createApp } from './app.js';
import { runMigrations } from './db.js';

const PORT = process.env.PORT || 3000;

async function start() {
  // Migrate the configured database on startup (only when one is configured).
  if (process.env.DATABASE_URL) {
    await runMigrations(process.env.DATABASE_URL);
  }

  const app = createApp();
  const server = app.listen(PORT, () => {
    console.log(`Book REST API listening on http://localhost:${PORT}`);
  });

  server.on('error', (err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });
}

start();