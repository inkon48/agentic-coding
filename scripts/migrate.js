import 'dotenv/config';
import { runMigrations } from '../src/db.js';
import 'dotenv/config';

const url = process.env.DATABASE_URL;

if (!url) {
  console.error('DATABASE_URL is required to run migrations.');
  process.exit(1);
}

try {
  await runMigrations(url);
  console.log('Migrations applied successfully.');
} catch (err) {
  console.error('Migration failed:', err);
  process.exit(1);
}