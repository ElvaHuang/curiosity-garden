import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db;
  db = await SQLite.openDatabaseAsync('curiosity-garden.db');
  await initializeDatabase(db);
  return db;
}

async function initializeDatabase(database: SQLite.SQLiteDatabase): Promise<void> {
  await database.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      avatar_id TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS seeds (
      id TEXT PRIMARY KEY,
      question TEXT NOT NULL,
      input_mode TEXT NOT NULL DEFAULT 'text',
      photo_uri TEXT,
      category TEXT NOT NULL,
      growth_stage TEXT NOT NULL DEFAULT 'seed',
      conversation_depth INTEGER NOT NULL DEFAULT 0,
      garden_x REAL NOT NULL,
      garden_y REAL NOT NULL,
      created_at TEXT NOT NULL,
      last_interacted_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      seed_id TEXT NOT NULL,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      FOREIGN KEY (seed_id) REFERENCES seeds(id)
    );

    CREATE INDEX IF NOT EXISTS idx_messages_seed_id ON messages(seed_id);
  `);
}
