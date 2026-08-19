import { readFile } from 'node:fs/promises';
import pg from 'pg';

const { Pool } = pg;

const SCHEMA_URL = new URL('../db/schema.sql', import.meta.url);

/**
 * Apply the schema (CREATE TABLE IF NOT EXISTS) to the given database. async.
 */
export async function runMigrations(connectionString) {
  const pool = new Pool({ connectionString });
  try {
    const sql = await readFile(SCHEMA_URL, 'utf8');
    await pool.query(sql);
  } finally {
    await pool.end();
  }
}