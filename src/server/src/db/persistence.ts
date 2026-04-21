import { Pool } from 'pg';
import { GameState } from '@7wonders/shared';

let pool: Pool | null = null;

function getPool(): Pool | null {
  if (!process.env.DATABASE_URL) return null;
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: false },
    });
  }
  return pool;
}

/** Create the table if it doesn't exist. Called on server start. */
export async function initDb(): Promise<void> {
  const db = getPool();
  if (!db) return;
  await db.query(`
    CREATE TABLE IF NOT EXISTS game_rooms (
      room_id    TEXT PRIMARY KEY,
      state      JSONB NOT NULL,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);
  console.log('[db] Connected to PostgreSQL — persistence enabled');
}

/** Save (upsert) a game state. Silent no-op if no DATABASE_URL. */
export async function saveGame(roomId: string, state: GameState): Promise<void> {
  const db = getPool();
  if (!db) return;
  await db.query(
    `INSERT INTO game_rooms (room_id, state, updated_at)
     VALUES ($1, $2, NOW())
     ON CONFLICT (room_id) DO UPDATE
       SET state = EXCLUDED.state, updated_at = NOW()`,
    [roomId, JSON.stringify(state)],
  );
}

/** Load a game state. Returns null if not found or no DB. */
export async function loadGame(roomId: string): Promise<GameState | null> {
  const db = getPool();
  if (!db) return null;
  const result = await db.query('SELECT state FROM game_rooms WHERE room_id = $1', [roomId]);
  return result.rows[0]?.state ?? null;
}

/** Delete a finished game room. */
export async function deleteGame(roomId: string): Promise<void> {
  const db = getPool();
  if (!db) return;
  await db.query('DELETE FROM game_rooms WHERE room_id = $1', [roomId]);
}
