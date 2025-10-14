import { Pool } from 'pg';

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('neon.tech') ? { rejectUnauthorized: false } : undefined
});

export async function ensureSchema() {
  await pool.query(`
    CREATE EXTENSION IF NOT EXISTS vector;

    CREATE TABLE IF NOT EXISTS people_index (
      slug TEXT PRIMARY KEY,
      name TEXT,
      title TEXT,
      skills TEXT[],
      open_to_work BOOLEAN,
      content TEXT,
      embedding VECTOR(1536)
    );
    CREATE INDEX IF NOT EXISTS people_index_vec_idx
      ON people_index USING ivfflat (embedding vector_cosine_ops) WITH (lists=100);

    CREATE TABLE IF NOT EXISTS projects_index (
      slug TEXT PRIMARY KEY,
      title TEXT,
      summary TEXT,
      skills TEXT[],
      sectors TEXT[],
      content TEXT,
      embedding VECTOR(1536)
    );
    CREATE INDEX IF NOT EXISTS projects_index_vec_idx
      ON projects_index USING ivfflat (embedding vector_cosine_ops) WITH (lists=100);

    -- NEW: usage logging
    CREATE TABLE IF NOT EXISTS sharepack_events (
      id BIGSERIAL PRIMARY KEY,
      created_at TIMESTAMPTZ DEFAULT now(),
      kind TEXT,                            -- 'sharepack' | 'lead'
      requester_email TEXT,
      people_count INT,
      projects_count INT,
      people_slugs TEXT[],
      project_slugs TEXT[]
    );
  `);
}
